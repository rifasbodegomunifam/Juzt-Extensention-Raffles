import { LitElement, html, css, unsafeCSS } from 'lit';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import HandleRequest from '../request';
import filecss from '../../../assets/css/index.css?inline';

class RafflePaymentValidation extends LitElement {

    static properties = {
    };

    static styles = [css`${unsafeCSS(filecss)}`];

    constructor() {
        super();
        this.step = null;
        this.loading = false;
        this.steps = [
            { id: 1, name: "Identificate", description: "Ingresa tu correo electrónico y el ID de tu orden para validar tu pago.", active: true, block: false },
            { id: 2, name: "Sube tu comprobante", description: "Adjunta una imagen o PDF que demuestre tu pago.", active: false, block: false },
            { id: 3, name: "Resultado", description: "Estado de validacion", active: false, block: false }
        ];
        this.form = {};
        this.errorCaptured = null;
        this.orders = [];
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
        formData.append('payment_proof', file);
        formData.append('step', 2);
        formData.append('order_id', this.orders[0].id);

        try {
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
                this.setActiveStep(3);
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

    handleRenderOrders(){
        return html`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${this.orders.map(order => html`
                <div class="border p-4 rounded-md">
                    <h3 class="text-lg font-semibold mb-2">Orden #${order.id}</h3>
                    <p><strong>Correo:</strong> ${order.customer_email}</p>
                    <p><strong>Rifa:</strong> ${order.raffle_id}</p>
                    <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            `)}
        </div>`;
    }

    handleBackStep(stepId) {
        this.setActiveStep(stepId);
        this.orders = [];
    }

    render() {
        return html`
        <div>
            <nav class="w-full bg-gray-800 text-white p-4 rounded-t-md mb-6">
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
            <form id="payment-validation-form" class="w-full">
                ${this.loading ? html`
                    <div class="w-full h-64 flex items-center justify-center"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>
                ` : html`
                <div>
                    ${this.steps.map(step => html`
                    <div class="w-full mb-4 p-4 ${step.active ? 'block' : 'hidden'}">
                        <h2 class="text-2xl text-center font-semibold mb-2">${step.name}</h2>
                        <p class="text-gray-200 text-center">${step.description}</p>
                    </div>
                    
                    <div class="p-2 max-w-4xl mx-auto flex flex-col items-center justify-center">
                        ${step.id === 1 && step.active ? html`
                            <input type="email" name="email" placeholder="Correo electrónico" class="w-full mb-4 p-2 border border-white rounded-sm" required>
                            <button type="button" @click=${() => this.hadleCompleteValidation()} class="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Completar validación</button>` : ''}
                        
                        ${step.id === 2 && step.active ? html`
                            ${this.handleRenderOrders()}
                            <input type="file" name="payment_proof" accept="image/*,application/pdf" class="w-full mb-4 p-2" required>
                            <div class="flex justify-center gap-4 items-center">
                                <button type="button" @click=${() => this.handleBackStep(1)} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Atras</button>
                                <button type="button" @click=${() => this.handleSendProof()} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Enviar comprobante</button>
                            </div>` : ''}
                        
                        ${step.id === 3 && step.active ? html`
                            <p class="text-gray-700">Validación completada exitosamente.</p>
                            <p class="text-gray-700">Una vez validado tu pago, enviaremos un correo notificando la orden.</p>
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