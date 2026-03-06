import { LitElement, html, css, unsafeCSS } from 'lit';
import Toastify from 'toastify-js';
import HandleRequest from '../request';
import toastifyCss from "toastify-js/src/toastify.css?inline";
import filecss from '../../../assets/css/index.css?inline';

class RafflePaymentValidation extends LitElement {

    static properties = {
        imagePreviewUrl: { type: String },
    };

    static selfCSS = css`
    :host {
        display: block;
        min-height: 500px;
    }
    /* Reserva espacio para la cabecera oscura */
    nav {
        min-height: 160px; /* Evita que el nav salte al cargar los pasos */
    }
    /* Reserva espacio para el título */
    h1 {
        line-height: 1;
        min-height: 40px;
    }
    /* Evita que los pasos ocultos ocupen espacio o causen saltos */
    .hidden {
        display: none !important;
    }
`;

    static styles = [this.selfCSS, css`${unsafeCSS(filecss)}`, css`${unsafeCSS(toastifyCss)}`];

    constructor() {
        super();
        
        this.step = null;
        this.loading = false;
        this.steps = [
            { id: 1, name: "Identificate", description: "Ingresa tu correo electrónico para validar tus órdenes.", active: true, block: false },
            { id: 2, name: "Ordenes a tu nombre", description: "Seleciona la orden que deseas pagar", active: false, block: false },
            { id: 3, name: "Sube tu comprobante", description: "Adjunta una imagen que demuestre tu pago.", active: false, block: false },
            { id: 4, name: "Resultado", description: "Estado de validacion", active: false, block: false }
        ];
        this.form = {};
        this.errorCaptured = null;
        this.orders = [];

        const queryParams = new URLSearchParams(window.location.search);
        const step = queryParams.get('step');
        if (step) {
            const stepId = parseInt(step);
            if (stepId >= 1 && stepId <= this.steps.length) {
                this.setActiveStep(stepId);
            }
        }
    }

    setActiveStep(id) {
        this.steps = this.steps.map(step => {
            step.active = step.id === id;
            return step;
        });
        this.requestUpdate();
    }

    setBlockStep(id) {
        this.steps = this.steps.map(step => {
            if (step.id === id) {
                step.block = true;
            }
            return step;
        });
        this.requestUpdate();
    }

    hadleCompleteValidation() {
        const form = this.shadowRoot.getElementById('payment-validation-form');
        const formData = new FormData(form);
        const email = formData.get('email');
        this.form.email = email;
        if (!email) {
            Toastify({
                text: "Por favor ingresa un correo electrónico válido.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#f56565",
            }).showToast();
            return;
        }

        try {
            this.loading = true;
            HandleRequest.getOrdersByEmail(email)
                .then(orders => {
                    if (orders.length === 0) {
                        throw new Error('No se encontraron órdenes para este correo.');
                    }
                    this.orders = orders;
                    this.setBlockStep(1);
                    this.setActiveStep(2);
                    this.loading = false;
                })
                .catch(error => {
                    Toastify({
                        text: error.message,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#f56565",
                    }).showToast();
                })
                .finally(() => {
                    this.loading = false;
                });
        } catch (error) {
            Toastify({
                text: error.message,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#f56565",
            }).showToast();
        }
    }

    async handleSendProof() {


        try {
            const form = this.shadowRoot.getElementById('payment-validation-form');
            const formData = new FormData(form);
            const fileInput = form.querySelector('input[name="payment_proof"]');
            const file = fileInput.files[0];
            if (!file) {
                Toastify({
                    text: "Por favor adjunta un comprobante de pago.",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#f56565",
                }).showToast();
                return;
            }
            formData.append('email', this.form.email);
            formData.append('step', 2);
            formData.append('order_id', this.orders[0].id);

            this.loading = true;
            const response = await HandleRequest.sendPaymentProof(formData);
            if (response.success) {
                Toastify({
                    text: "Comprobante enviado exitosamente. Estamos validando tu pago.",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#48bb78",
                }).showToast();
                this.setBlockStep(3);
                this.setActiveStep(4);
            } else {
                throw new Error(response.data || 'Error al enviar el comprobante.');
            }
        } catch (error) {
            Toastify({
                text: error.message,
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#f56565",
            }).showToast();
        } finally {
            this.loading = false;
        }
    }

    seletOrder(orderId) {
        this.form.orderId = orderId;
        this.setBlockStep(2);
        this.setActiveStep(3);
    }

    handleBackStep(stepId, clear = false) {
        this.setActiveStep(stepId);
        if (clear) {
            this.orders = [];
        }
    }

    handleRenderEmailForm() {
        return html`
        <input type="email" name="email" placeholder="Correo electrónico" class="w-full mb-4 p-2 border border-white rounded-sm" required>
        <button type="button" @click=${() => this.hadleCompleteValidation()} class="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Completar validación</button>
        `;
    }

    handleRenderOrders() {
        return html`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${this.orders.map(order => html`
                <div class="border p-4 rounded-md">
                    <h3 class="text-lg font-semibold mb-2">Orden #${order.order_number}</h3>
                    <p><strong>Correo:</strong> ${order.customer_email}</p>
                    <p><strong>Rifa:</strong> ${order.raffle.title}</p>
                    <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                    <button type="button" @click=${() => { this.seletOrder(order.id); }} class="cursor-pointer mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Seleccionar esta orden</button>
                </div>
            `)}
        </div>
        <button type="button" @click=${() => this.handleBackStep(1, true)} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Atras</button>`;
    }

    handlePreviewProof() {
        const form = this.shadowRoot.getElementById('payment-validation-form');
        const fileInput = form.querySelector('input[name="payment_proof"]');
        const file = fileInput.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            this.imagePreviewUrl = url;
        }
    }

    handleRenderUploadProof() {
        return html`
        <div class="flex items-center justify-center w-full mb-6">
            <label for="payment_proof" class="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                <div class="flex flex-col items-center justify-center text-body pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                    <p class="mb-2 text-sm"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs">PNG, JPG</p>
                </div>
                <input id="payment_proof" type="file" class="hidden" name="payment_proof" @change=${() => this.handlePreviewProof()} />
            </label>
        </div> 
        ${this.imagePreviewUrl ? html`<img src="${this.imagePreviewUrl}" alt="Vista previa del comprobante" class="w-full max-h-64 object-contain mb-4 p-2 rounded-md">` : ''}
        <div class="flex justify-center gap-4 items-center">
            <button type="button" @click=${() => this.handleBackStep(2, false)} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Atras</button>
            <button type="button" @click=${() => this.handleSendProof()} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Enviar comprobante</button>
        </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        
    }

    render() {
        return html`
        <div>
            <nav class="w-full bg-red-500 text-white p-4 rounded-t-md mb-6">
                <div class="flex flex-col gap-2">
                    <h1 class="text-4xl text-center font-bold">Validación de Pago</h1>
                    <ul class="flex items-center justify-center space-x-10 mt-6">
                        ${this.steps.map(step => html`
                            <li
                                class="border text-white hover:bg-red-900 rounded-full flex items-center justify-center w-12 h-12 ${step.active ? 'bg-red-900 pointer-events-none' : step.block ? 'bg-red-900 cursor-not-allowed' : 'bg-red-500 cursor-pointer'}"
                                @click=${() => step.active ? null : step.block ? null : this.setActiveStep(step.id)}
                                disabled=${step.block ? 'disabled' : null}
                            >
                                ${step.id}
                            </li>
                        `)}
                    </ul>
                </div>
            </nav>
            <form role="form" id="payment-validation-form" class="w-full">
                ${this.loading ? html`
                    <div class="w-full h-64 flex items-center justify-center"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>
                ` : html`
                <div>
                    ${this.steps.map(step => html`
                    <div class="w-full mb-4 p-4 ${step.active ? 'block' : 'hidden'}">
                        <h2 class="text-4xl text-center font-semibold mb-2">${step.name}</h2>
                        <p class="text-2xl! text-gray-200 text-center">${step.description}</p>
                    </div>
                    
                    <div class="p-2 max-w-4xl mx-auto flex flex-col items-center justify-center">

                        ${step.id === 1 && step.active === true ? this.handleRenderEmailForm() : ''}
                        
                        ${step.id === 2 && step.active === true ? html`${this.handleRenderOrders()}` : ''}

                        ${step.id === 3 && step.active === true ? this.handleRenderUploadProof() : ''}
                        
                        ${step.id === 4 && step.active === true ? html`
                            <p class="text-white">Validación completada exitosamente.</p>
                            <p class="text-white">Una vez validado tu pago, enviaremos un correo notificando la orden.</p>
                        ` : ''}
                    </div>
                `)}
                </div>`}
                
                <div class="w-full">
                </div>
            </form>
        </div>
        `;
    }
}

customElements.define('raffle-payment-validation', RafflePaymentValidation);