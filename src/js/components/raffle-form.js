import { LitElement, html, css, unsafeCSS } from 'lit';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import HandleRequest from '../request';
import filecss from '../../../assets/css/index.css?inline';

class RaffleForm extends LitElement {

    static properties = {
        allowinstallments: { type: Boolean },
        payments: { type: Array },
        selectedPaymentIndex: { type: Number },
        raffle: { type: Number },
        price: { type: Number },
        rateexchange: { type: String },
        quantity: { type: Number },
        totalPrice: { type: Number },
        selectedFile: { type: Object },
        cta_text: { type: String },
        loading: { type: Boolean },
        proccesing: { type: Boolean },
        showone: { type: String }
    };

    static styles = [css`${unsafeCSS(filecss)}`];

    constructor() {
        super();
        this.payments = [];
        this.selectedPaymentIndex = null;
        this.raffle = null;
        this.rateexchange = '{}';
        this.rates = {};
        this.price = 0;
        this.quantity = 1;
        this.ticketPrice = 0;
        this.totalPrice = 0;
        this.totalRate = { cop: 0, ves: 0 };
        this.selectedFile = null;
        this.loading = true;
        this.showForm = true;
        this.proccesing = false;
        this.cta_text = "Confirmar Compra";
        this.showone = "paused";
        this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.allowinstallments = false;

    }

    togglePayment(index) {
        // ✅ Si ya está abierto, cerrar; si no, abrir
        if (this.selectedPaymentIndex === index) {
            this.selectedPaymentIndex = null; // Cerrar
        } else {
            this.selectedPaymentIndex = index; // Abrir este, cerrar los demás
        }
    }

    isPaymentOpen(index) {
        return this.openPayments.has(index);
    }

    connectedCallback() {
        super.connectedCallback();

        // Parsear items si viene como string
        if (typeof this.payments === 'string') {
            try {
                this.payments = JSON.parse(this.payments);
            } catch (e) {
                console.error('Error parsing menu items:', e);
                this.payments = [];
            }
        }

        if(typeof this.allowinstallments === 'string') {
            this.allowinstallments = this.allowinstallments === 'true';
        }

        window.addEventListener('raffle-countdown:ready', (event) => {
            this.showForm = !event.detail.status;
            this.loading = false;
        });

        if (this.showone == "paused") {
            this.numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.quantity = 2;
        }

        this.loading = false;
    }

    onCopy(value) {
        navigator
            .clipboard
            .writeText(value)
            .then(() => {
                Toastify({
                    text: "Valor copiado",
                    duration: 1500,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "oklch(0.577 0.245 27.325)",
                    },
                    onClick: function () { } // Callback after click
                }).showToast();
            })
            .catch((error) => {
                Toastify({
                    text: "Error al copiar",
                    duration: 1500,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "oklch(0.577 0.245 27.325)",
                    },
                    onClick: function () { } // Callback after click
                }).showToast();
            });
    }

    // ✅ Agregar este lifecycle method
    willUpdate(changedProperties) {
        // Cuando price cambie, actualizar ticketPrice y total
        if (changedProperties.has('price') && this.price > 0) {
            this.ticketPrice = this.price;
            this.updateTotal();
        }

        // ✅ Parsear el JSON string
        if (changedProperties.has('rateexchange')) {
            try {
                this.rates = JSON.parse(this.rateexchange);
                this.updateTotal();
            } catch (e) {
                console.error('Error parseando rates:', e);
                this.rates = { cop: 1, ves: 1 };
            }
        }

        console.log("loading", this.loading);
    }

    incrementQuantity() {
        if (this.quantity < 50) {
            this.quantity++;
            this.updateTotal();
        }
    }

    decrementQuantity() {
        let limit = 1;
        if (this.showone == 'paused') {
            limit = 2;
        }

        if (this.quantity > limit) {
            this.quantity--;
            this.updateTotal();
        }
    }

    setQuantity(qty) {
        this.quantity = qty;
        this.updateTotal();
    }

    updateTotal() {
        this.totalPrice = this.quantity * this.ticketPrice;
        this.totalRate = {
            cop: this.totalPrice * this.rates.cop,
            ves: this.totalPrice * this.rates.ves
        };
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // ✅ Validar que sea imagen
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            Toastify({
                text: "Solo se aceptan imágenes (JPG, PNG, GIF, WEBP)",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#dc2626",
                }
            }).showToast();

            event.target.value = '';
            return;
        }

        // ✅ Validar tamaño
        if (file.size > 5 * 1024 * 1024) {
            Toastify({
                text: "La imagen es demasiado grande. Máximo 5MB",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#dc2626",
                }
            }).showToast();

            event.target.value = '';
            return;
        }

        // ✅ Crear preview de la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedFile = {
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                file: file,
                preview: e.target.result // Base64 para preview
            };
            console.log(this.selectedFile);
        };
        reader.readAsDataURL(file);
    }

    removeFile() {
        this.selectedFile = null;
        const input = this.querySelector('#comprobante'); // Sin shadowRoot
        if (input) input.value = '';
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.proccesing = true;
        this.cta_text = "Procesando";
        const formData = new FormData(event.target);

        const data = {
            raffle_id: this.raffle,
            customer_name: formData.get('customer_name'),
            customer_email: formData.get('customer_email'),
            customer_phone: formData.get('customer_phone'),
            customer_address: formData.get('customer_address'),
            ticket_quantity: this.quantity,
            total_amount: this.totalPrice,
            comprobante: this.selectedFile?.file
        };

        try {
            console.log('Datos del formulario:', data);
            const order_create = await HandleRequest.saveOrder(data);

            console.log('Orden creada:', order_create);

            this.proccesing = false;
            this.cta_text = "Orden creada, redirigiendo en 5 segundos";

            setTimeout(() => {
                window.location.href = `/orden-completada?orden=${order_create.order}`;
            }, 5000);

        } catch (error) {
            console.error('Error capturado:', error);

            this.proccesing = false;
            this.cta_text = "Error al procesar orden";

            // ✅ Mostrar toast con el error
            Toastify({
                text: error.message || "Ha ocurrido un error al procesar la orden",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#dc2626", // Rojo
                }
            }).showToast();

            // ✅ Resetear después de 3 segundos
            setTimeout(() => {
                this.cta_text = "Confirmar Compra";
            }, 3000);
        }
    }

    render() {
        if (this.loading) {
            return html`
            <main class="w-full rounded-lg">
                <h3 class="text-3xl text-center font-bold text-white mb-6">Cargando</h3>
            </main>
            `;
        }

        if (!this.showForm) {
            return html`
            <main class="w-full rounded-lg">
                <h3 class="text-3xl text-center font-bold text-white mb-6">Sorteo finalizado</h3>
            </main> 
            `;
        }

        const decrementClass = [
            'w-12',
            'h-12',
            'bg-red-600',
            'hover:bg-red-700',
            'text-white',
            'rounded-lg',
            'font-bold',
            'text-xl',
            'transition-colors',
            'flex',
            'items-center',
            'justify-center',
        ];

        console.log("Price", this.totalRate);

        if ((this.showone === "paused" && this.quantity === 2) || (this.showone === 'active' && this.quantity == 1)) {
            decrementClass.push('pointer-none cursor-not-allowed');
        } else {
            decrementClass.push('cursor-pointer');
        }

        const installmentText = this.allowinstallments ? html`
        <div class="rounded-md p-6 flex flex-col gap-2 bg-red-600 mb-8">
            <h6 class="text-center text-xl lg:text-2xl text-red-100! font-bold mb-1 lg:mb-4">¡Puedes pagar en cuotas!</h6>
            <p class="text-center text-red-100!">Selecciona la cantidad de boletos que deseas comprar y te mostraremos el total a pagar en dólares, pesos colombianos y bolívares venezolanos.</p>
        </div>
        ` : html``;

        return html`
        <main class="w-full rounded-lg">
            <h3 class="text-xl lg:text-3xl text-center font-bold text-white mb-6">Ingresa tu información</h3>

            ${installmentText}

            <form @submit=${this.handleSubmit} class="space-y-6 flex flex-col">
            
                <!-- Datos Personales -->
                <div class="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-gray-800 max-[1024px]:order-2">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        Datos Personales
                    </h2>

                    <div class="grid sm:grid-cols-1 gap-4">
                        <div>
                            <label for="nombre" class="block text-sm font-medium text-gray-300 mb-2">
                                Nombre y Apellido <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="customer_name"
                                name="customer_name"
                                required
                                placeholder="Juan"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <!-- Información de Contacto -->
                <div class="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-gray-800 max-[1024px]:order-2">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        Información de Contacto
                    </h2>

                    <div class="space-y-4">
                        <div>
                            <label for="correo" class="block text-sm font-medium text-gray-300 mb-2">
                                Correo Electrónico <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                id="customer_email"
                                name="customer_email"
                                required
                                placeholder="juan.perez@ejemplo.com"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                            />
                        </div>

                        <div>
                            <label for="telefono" class="block text-sm font-medium text-gray-300 mb-2">
                                Whatsapp <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                id="customer_phone"
                                name="customer_phone"
                                required
                                placeholder="+57 300 123 4567"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                            />
                        </div>

                        <div>
                            <label for="direccion" class="block text-sm font-medium text-gray-300 mb-2">
                                Dirección <span class="text-red-600">*</span>
                            </label>
                            <textarea
                                id="customer_address"
                                name="customer_address"
                                required
                                rows="3"
                                placeholder="Calle 123 #45-67, Apartamento 8B, Bogotá"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Selección de Boletos -->
                <div class="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-gray-800 max-[1024px]:order-1">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                        </svg>
                        Cantidad de Boletos
                    </h2>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-300 mb-3">Selección rápida:</label>
                        <div class="grid grid-cols-5 gap-2">
                            
                            ${this.numbers.map(qty => html`
                                <button
                                    type="button"
                                    @click=${() => this.setQuantity(qty)}
                                    class="quick-select bg-[#0f0f0f] border-2 ${this.quantity === qty ? 'border-red-600 bg-red-600/10' : 'border-gray-700'} hover:border-red-600 text-white font-semibold py-3 rounded-lg transition-all"
                                >
                                    ${qty}
                                </button>
                            `)}
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-3">Cantidad personalizada:</label>
                        <div class="flex items-center gap-4">
                            <button
                                type="button"
                                @click=${this.decrementQuantity}
                                class="${decrementClass.join(" ")}"
                                ${(this.showone == 'paused' && this.quantity == 2) ? 'disabled' : ''}
                            >
                                -
                            </button>
                            
                            <div class="flex-1 relative">
                                <input
                                    type="text"
                                    id="ticket_quantity"
                                    name="ticket_quantity"
                                    min="1"
                                    max="50"
                                    .value=${this.quantity}
                                    readonly
                                    class="w-full bg-[#0f0f0f] border-2 border-gray-700 rounded-lg px-4 py-3 text-center text-2xl font-bold text-white focus:outline-none focus:border-red-600 transition-colors"
                                />
                                
                            </div>
                            
                            <button
                                type="button"
                                @click=${this.incrementQuantity}
                                class="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xl transition-colors flex items-center justify-center cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                        
                        <div class="mt-4 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                            <div class="flex justify-between items-center flex-col lg:flex-row!">
                                <span class="text-gray-300 font-medium">Total a pagar:</span>
                                <span class="text-md font-bold text-red-500">${new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                    }).format(this.totalPrice)}
                                </span>
                                
                                ${this.totalPrice.cop > 0 ? html`
                                <span class="text-md font-bold text-red-500">${new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                    }).format(this.totalRate.cop)}
                                </span>` : html`<span class="text-xs text-center w-20 block items-center">Conversion no disponible</span>`}
                                
                                ${this.totalPrice.ves > 0 ? html`<span class="text-md font-bold text-red-500">${new Intl.NumberFormat('es-VE', {
                                    style: 'currency',
                                    currency: 'VES',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                    }).format(this.totalRate.ves)}
                                </span>` : html`<span class="text-xs text-center w-20 block items-center">Conversion no disponible</span>`}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Comprobante de Pago -->
                <div class="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-gray-800 max-[1024px]:order-3">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Comprobante de Pago
                    </h2>
                    
                    <p class="text-lg text-gray-300 mb-2">Realiza tu transferencia a:</p>
                    
                    <div class="flex flex-wrap gap-1.5 md:gap-3 mb-8">
                    ${this.payments.map((item, index) => html`
                        <button @click="${() => this.togglePayment(index)}" type="button" class="w-[50px] bg-white h-[50px] rounded-sm border border-red-600 cursor-pointer transition-all scale-100 hover:scale-110">
                            ${this.selectedPaymentIndex === index ? html `<lucide-icon class="text-red-600 text-2xl" name="x" size="32"></lucide-icon>` : html `<img
                                class="w-full h-full object-cover"
                                loading="lazy"
                                src="${item.settings.logo_bank}"
                                srcset="${item.settings.logo_bank_src}"
                                alt="${item.settings.account_bank}"
                                aria-labelby="Button for pyment method using ${item.settings.account_bank}"
                            />`}
                            
                        </button>
                    ` )}
                    </div>

                    ${this.payments.map((item, index) => html`
                        ${this.selectedPaymentIndex == index ? html `
                            <div class="mb-4 p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg">
                                <div class="space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Banco:</span>
                                        <span class="text-white font-semibold">${item.settings.account_bank}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Tipo:</span>
                                        <div class="flex justify-end lg:justify-between! gap-x-2.5 flex-wrap">
                                            <span class="text-white font-semibold">${item.settings.account_type}</span>
                                            <button @click=${() => this.onCopy(item.settings.account_type)} type="button" class="flex gap-1 items-center cursor-pointer">
                                                <lucide-icon name="copy" size="16"></lucide-icon>
                                                <span>Copiar</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex justify-between gap-2.5 items-center">
                                        <span class="text-gray-400">Cuenta:</span>
                                        <div class="flex justify-end lg:justify-between! gap-x-2.5 flex-wrap">
                                            <span class="text-white font-semibold">${item.settings.account_number}</span>
                                            <button @click=${() => this.onCopy(item.settings.account_number)} type="button" class="flex gap-1 items-center cursor-pointer">
                                                <lucide-icon name="copy" size="16"></lucide-icon>
                                                <span>Copiar</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Titular:</span>
                                        <div class="flex justify-end lg:justify-between! gap-x-2.5 flex-wrap">
                                            <span class="text-white font-semibold">${item.settings.account_name}</span>
                                            <button @click=${() => this.onCopy(item.settings.account_name)} type="button" class="flex gap-1 items-center cursor-pointer">
                                                <lucide-icon name="copy" size="16"></lucide-icon>
                                                <span>Copiar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    `)}

                    <div>
                        <label for="comprobante" class="block text-sm font-medium text-gray-300 mb-2">
                            Subir Comprobante <span class="text-red-600">*</span>
                        </label>
                        
                        <div class="relative">
                            <input
                                type="file"
                                id="comprobante"
                                name="comprobante"
                                accept="image/*,.pdf"
                                required
                                @change=${this.handleFileSelect}
                                class="hidden"
                            />
                            
                            <label
                                for="comprobante"
                                class="block w-full bg-[#0f0f0f] border-2 border-dashed ${this.selectedFile ? 'hidden' : ''} border-gray-700 hover:border-red-600 rounded-lg p-8 text-center cursor-pointer transition-all"
                            >
                                <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                <p class="text-gray-400 mb-1">
                                    <span class="text-red-600 font-semibold">Haz clic para subir</span> o arrastra el archivo
                                </p>
                                <p class="text-sm text-gray-500">PNG, JPG, PDF (máx. 5MB)</p>
                            </label>
                        </div>

                        ${(this.selectedFile != null || this.selectedFile != undefined) ? html`
                            <div class="mt-4 p-4 bg-[#0f0f0f] border border-green-600 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <div>
                                            <p class="text-white font-semibold">${this.selectedFile.name}</p>
                                            <p class="text-sm text-gray-400">${this.selectedFile.size}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        @click=${this.removeFile}
                                        class="text-red-600 hover:text-red-500 transition-colors"
                                    >
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Términos y Condiciones -->
                <div class="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-gray-800 max-[1024px]:order-5">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            id="terminos"
                            name="terminos"
                            required
                            class="w-5 h-5 mt-0.5 bg-[#0f0f0f] border-2 border-gray-700 rounded text-red-600 focus:ring-red-600 focus:ring-offset-0"
                        />
                        <span class="text-sm text-gray-300">
                            Acepto los <a href="#" class="text-red-600 hover:underline">términos y condiciones</a> y autorizo el tratamiento de mis datos personales de acuerdo a la <a href="#" class="text-red-600 hover:underline">política de privacidad</a>.
                        </span>
                    </label>
                </div>

                <button
                    ${this.proccesing ? 'disabled' : ''}
                    type="submit"
                    class="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-red-600/50 text-lg max-[1024px]:order-6"
                >
                    ${this.cta_text}
                </button>

            </form>
        </main>
        `;
    }
}

window.customElements.define('raffle-form', RaffleForm);