import { LitElement, html } from 'lit';

class RaffleForm extends LitElement {

    static properties = {
        raffle: { type: Number },
        quantity: { type: Number },
        totalPrice: { type: Number },
        selectedFile: { type: Object }
    };

    // ESTO DESACTIVA EL SHADOW DOM
    createRenderRoot() {
        return this; // Usa Light DOM en lugar de Shadow DOM
    }

    constructor() {
        super();
        this.raffle = null;
        this.quantity = 1;
        this.ticketPrice = 25;
        this.totalPrice = 25;
        this.selectedFile = null;
    }

    incrementQuantity() {
        if (this.quantity < 50) {
            this.quantity++;
            this.updateTotal();
        }
    }

    decrementQuantity() {
        if (this.quantity > 1) {
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
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 5MB.');
            event.target.value = '';
            return;
        }

        this.selectedFile = {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            file: file
        };
    }

    removeFile() {
        this.selectedFile = null;
        const input = this.querySelector('#comprobante'); // Sin shadowRoot
        if (input) input.value = '';
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            correo: formData.get('correo'),
            telefono: formData.get('telefono'),
            direccion: formData.get('direccion'),
            cantidad: this.quantity,
            total: this.totalPrice,
            comprobante: this.selectedFile?.file
        };

        console.log('Datos del formulario:', data);
        
        this.dispatchEvent(new CustomEvent('form-submit', {
            detail: data,
            bubbles: true,
            composed: true
        }));

        alert('¡Compra confirmada! Te enviaremos un correo de confirmación.');
    }

    render() {
        return html`
        <main class="w-full rounded-lg">
            <h3 class="text-3xl text-center font-bold text-white mb-6">Ingresa tu información</h3>
            
            <form @submit=${this.handleSubmit} class="space-y-6">
            
                <!-- Datos Personales -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        Datos Personales
                    </h2>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label for="nombre" class="block text-sm font-medium text-gray-300 mb-2">
                                Nombre <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                required
                                placeholder="Juan"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                            />
                        </div>

                        <div>
                            <label for="apellido" class="block text-sm font-medium text-gray-300 mb-2">
                                Apellido <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                required
                                placeholder="Pérez"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <!-- Información de Contacto -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
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
                                id="correo"
                                name="correo"
                                required
                                placeholder="juan.perez@ejemplo.com"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                            />
                        </div>

                        <div>
                            <label for="telefono" class="block text-sm font-medium text-gray-300 mb-2">
                                Teléfono <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
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
                                id="direccion"
                                name="direccion"
                                required
                                rows="3"
                                placeholder="Calle 123 #45-67, Apartamento 8B, Bogotá"
                                class="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Selección de Boletos -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                        </svg>
                        Cantidad de Boletos
                    </h2>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-300 mb-3">Selección rápida:</label>
                        <div class="grid grid-cols-4 gap-2">
                            ${[1, 3, 5, 10].map(qty => html`
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
                                class="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xl transition-colors flex items-center justify-center"
                            >
                                -
                            </button>
                            
                            <div class="flex-1 relative">
                                <input
                                    type="text"
                                    id="cantidad"
                                    name="cantidad"
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
                                class="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xl transition-colors flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                        
                        <div class="mt-4 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-300 font-medium">Total a pagar:</span>
                                <span class="text-3xl font-bold text-red-600">$${this.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Comprobante de Pago -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Comprobante de Pago
                    </h2>

                    <div class="mb-4 p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg">
                        <p class="text-sm text-gray-300 mb-2">Realiza tu transferencia a:</p>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Banco:</span>
                                <span class="text-white font-semibold">Bancolombia</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Cuenta:</span>
                                <span class="text-white font-semibold">123-456789-10</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Titular:</span>
                                <span class="text-white font-semibold">RifasPro SAS</span>
                            </div>
                        </div>
                    </div>

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

                        ${this.selectedFile ? html`
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
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
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
                    type="submit"
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-red-600/50 text-lg"
                >
                    Confirmar Compra
                </button>

            </form>
        </main>
        `;
    }
}

window.customElements.define('raffle-form', RaffleForm);