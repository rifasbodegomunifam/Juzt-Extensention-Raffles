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
        showone: { type: String },
        phoneNumber: { type: String },

        // ✅ AGREGAR ESTAS PROPIEDADES
        selectedCountry: { type: String },
        phoneValue: { type: String },
        showDropdown: { type: Boolean }
    };

    static styles = [
        css`${unsafeCSS(filecss)}`,
    ];

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

        this.phoneNumber = '';
        this.itiInstance = null;

        this.countries = [
            // América
            { code: 'AR', name: 'Argentina', dialCode: '+54' },
            { code: 'BO', name: 'Bolivia', dialCode: '+591' },
            { code: 'BR', name: 'Brasil', dialCode: '+55' },
            { code: 'CA', name: 'Canadá', dialCode: '+1' },
            { code: 'CL', name: 'Chile', dialCode: '+56' },
            { code: 'CO', name: 'Colombia', dialCode: '+57' },
            { code: 'CR', name: 'Costa Rica', dialCode: '+506' },
            { code: 'CU', name: 'Cuba', dialCode: '+53' },
            { code: 'DO', name: 'República Dominicana', dialCode: '+1' },
            { code: 'EC', name: 'Ecuador', dialCode: '+593' },
            { code: 'SV', name: 'El Salvador', dialCode: '+503' },
            { code: 'GT', name: 'Guatemala', dialCode: '+502' },
            { code: 'HT', name: 'Haití', dialCode: '+509' },
            { code: 'HN', name: 'Honduras', dialCode: '+504' },
            { code: 'MX', name: 'México', dialCode: '+52' },
            { code: 'NI', name: 'Nicaragua', dialCode: '+505' },
            { code: 'PA', name: 'Panamá', dialCode: '+507' },
            { code: 'PY', name: 'Paraguay', dialCode: '+595' },
            { code: 'PE', name: 'Perú', dialCode: '+51' },
            { code: 'PR', name: 'Puerto Rico', dialCode: '+1' },
            { code: 'UY', name: 'Uruguay', dialCode: '+598' },
            { code: 'US', name: 'Estados Unidos', dialCode: '+1' },
            { code: 'VE', name: 'Venezuela', dialCode: '+58' },

            // Europa
            { code: 'AL', name: 'Albania', dialCode: '+355' },
            { code: 'AD', name: 'Andorra', dialCode: '+376' },
            { code: 'AT', name: 'Austria', dialCode: '+43' },
            { code: 'BE', name: 'Bélgica', dialCode: '+32' },
            { code: 'BA', name: 'Bosnia y Herzegovina', dialCode: '+387' },
            { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
            { code: 'HR', name: 'Croacia', dialCode: '+385' },
            { code: 'CY', name: 'Chipre', dialCode: '+357' },
            { code: 'CZ', name: 'República Checa', dialCode: '+420' },
            { code: 'DK', name: 'Dinamarca', dialCode: '+45' },
            { code: 'EE', name: 'Estonia', dialCode: '+372' },
            { code: 'FI', name: 'Finlandia', dialCode: '+358' },
            { code: 'FR', name: 'Francia', dialCode: '+33' },
            { code: 'DE', name: 'Alemania', dialCode: '+49' },
            { code: 'GR', name: 'Grecia', dialCode: '+30' },
            { code: 'HU', name: 'Hungría', dialCode: '+36' },
            { code: 'IS', name: 'Islandia', dialCode: '+354' },
            { code: 'IE', name: 'Irlanda', dialCode: '+353' },
            { code: 'IT', name: 'Italia', dialCode: '+39' },
            { code: 'LV', name: 'Letonia', dialCode: '+371' },
            { code: 'LT', name: 'Lituania', dialCode: '+370' },
            { code: 'LU', name: 'Luxemburgo', dialCode: '+352' },
            { code: 'MT', name: 'Malta', dialCode: '+356' },
            { code: 'MD', name: 'Moldavia', dialCode: '+373' },
            { code: 'MC', name: 'Mónaco', dialCode: '+377' },
            { code: 'ME', name: 'Montenegro', dialCode: '+382' },
            { code: 'NL', name: 'Países Bajos', dialCode: '+31' },
            { code: 'NO', name: 'Noruega', dialCode: '+47' },
            { code: 'PL', name: 'Polonia', dialCode: '+48' },
            { code: 'PT', name: 'Portugal', dialCode: '+351' },
            { code: 'RO', name: 'Rumania', dialCode: '+40' },
            { code: 'RU', name: 'Rusia', dialCode: '+7' },
            { code: 'RS', name: 'Serbia', dialCode: '+381' },
            { code: 'SK', name: 'Eslovaquia', dialCode: '+421' },
            { code: 'SI', name: 'Eslovenia', dialCode: '+386' },
            { code: 'ES', name: 'España', dialCode: '+34' },
            { code: 'SE', name: 'Suecia', dialCode: '+46' },
            { code: 'CH', name: 'Suiza', dialCode: '+41' },
            { code: 'UA', name: 'Ucrania', dialCode: '+380' },
            { code: 'GB', name: 'Reino Unido', dialCode: '+44' },
            { code: 'VA', name: 'Ciudad del Vaticano', dialCode: '+379' },

            // Asia
            { code: 'AF', name: 'Afganistán', dialCode: '+93' },
            { code: 'AM', name: 'Armenia', dialCode: '+374' },
            { code: 'AZ', name: 'Azerbaiyán', dialCode: '+994' },
            { code: 'BH', name: 'Baréin', dialCode: '+973' },
            { code: 'BD', name: 'Bangladés', dialCode: '+880' },
            { code: 'BT', name: 'Bután', dialCode: '+975' },
            { code: 'BN', name: 'Brunéi', dialCode: '+673' },
            { code: 'KH', name: 'Camboya', dialCode: '+855' },
            { code: 'CN', name: 'China', dialCode: '+86' },
            { code: 'GE', name: 'Georgia', dialCode: '+995' },
            { code: 'IN', name: 'India', dialCode: '+91' },
            { code: 'ID', name: 'Indonesia', dialCode: '+62' },
            { code: 'IR', name: 'Irán', dialCode: '+98' },
            { code: 'IQ', name: 'Irak', dialCode: '+964' },
            { code: 'IL', name: 'Israel', dialCode: '+972' },
            { code: 'JP', name: 'Japón', dialCode: '+81' },
            { code: 'JO', name: 'Jordania', dialCode: '+962' },
            { code: 'KZ', name: 'Kazajistán', dialCode: '+7' },
            { code: 'KW', name: 'Kuwait', dialCode: '+965' },
            { code: 'KG', name: 'Kirguistán', dialCode: '+996' },
            { code: 'LA', name: 'Laos', dialCode: '+856' },
            { code: 'LB', name: 'Líbano', dialCode: '+961' },
            { code: 'MY', name: 'Malasia', dialCode: '+60' },
            { code: 'MV', name: 'Maldivas', dialCode: '+960' },
            { code: 'MN', name: 'Mongolia', dialCode: '+976' },
            { code: 'MM', name: 'Myanmar', dialCode: '+95' },
            { code: 'NP', name: 'Nepal', dialCode: '+977' },
            { code: 'KP', name: 'Corea del Norte', dialCode: '+850' },
            { code: 'OM', name: 'Omán', dialCode: '+968' },
            { code: 'PK', name: 'Pakistán', dialCode: '+92' },
            { code: 'PS', name: 'Palestina', dialCode: '+970' },
            { code: 'PH', name: 'Filipinas', dialCode: '+63' },
            { code: 'QA', name: 'Catar', dialCode: '+974' },
            { code: 'SA', name: 'Arabia Saudita', dialCode: '+966' },
            { code: 'SG', name: 'Singapur', dialCode: '+65' },
            { code: 'KR', name: 'Corea del Sur', dialCode: '+82' },
            { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
            { code: 'SY', name: 'Siria', dialCode: '+963' },
            { code: 'TW', name: 'Taiwán', dialCode: '+886' },
            { code: 'TJ', name: 'Tayikistán', dialCode: '+992' },
            { code: 'TH', name: 'Tailandia', dialCode: '+66' },
            { code: 'TR', name: 'Turquía', dialCode: '+90' },
            { code: 'TM', name: 'Turkmenistán', dialCode: '+993' },
            { code: 'AE', name: 'Emiratos Árabes Unidos', dialCode: '+971' },
            { code: 'UZ', name: 'Uzbekistán', dialCode: '+998' },
            { code: 'VN', name: 'Vietnam', dialCode: '+84' },
            { code: 'YE', name: 'Yemen', dialCode: '+967' },

            // África
            { code: 'DZ', name: 'Argelia', dialCode: '+213' },
            { code: 'AO', name: 'Angola', dialCode: '+244' },
            { code: 'BJ', name: 'Benín', dialCode: '+229' },
            { code: 'BW', name: 'Botsuana', dialCode: '+267' },
            { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
            { code: 'BI', name: 'Burundi', dialCode: '+257' },
            { code: 'CM', name: 'Camerún', dialCode: '+237' },
            { code: 'CV', name: 'Cabo Verde', dialCode: '+238' },
            { code: 'CF', name: 'República Centroafricana', dialCode: '+236' },
            { code: 'TD', name: 'Chad', dialCode: '+235' },
            { code: 'KM', name: 'Comoras', dialCode: '+269' },
            { code: 'CG', name: 'Congo', dialCode: '+242' },
            { code: 'CD', name: 'República Democrática del Congo', dialCode: '+243' },
            { code: 'CI', name: 'Costa de Marfil', dialCode: '+225' },
            { code: 'DJ', name: 'Yibuti', dialCode: '+253' },
            { code: 'EG', name: 'Egipto', dialCode: '+20' },
            { code: 'GQ', name: 'Guinea Ecuatorial', dialCode: '+240' },
            { code: 'ER', name: 'Eritrea', dialCode: '+291' },
            { code: 'ET', name: 'Etiopía', dialCode: '+251' },
            { code: 'GA', name: 'Gabón', dialCode: '+241' },
            { code: 'GM', name: 'Gambia', dialCode: '+220' },
            { code: 'GH', name: 'Ghana', dialCode: '+233' },
            { code: 'GN', name: 'Guinea', dialCode: '+224' },
            { code: 'GW', name: 'Guinea-Bisáu', dialCode: '+245' },
            { code: 'KE', name: 'Kenia', dialCode: '+254' },
            { code: 'LS', name: 'Lesoto', dialCode: '+266' },
            { code: 'LR', name: 'Liberia', dialCode: '+231' },
            { code: 'LY', name: 'Libia', dialCode: '+218' },
            { code: 'MG', name: 'Madagascar', dialCode: '+261' },
            { code: 'MW', name: 'Malaui', dialCode: '+265' },
            { code: 'ML', name: 'Mali', dialCode: '+223' },
            { code: 'MR', name: 'Mauritania', dialCode: '+222' },
            { code: 'MU', name: 'Mauricio', dialCode: '+230' },
            { code: 'MA', name: 'Marruecos', dialCode: '+212' },
            { code: 'MZ', name: 'Mozambique', dialCode: '+258' },
            { code: 'NA', name: 'Namibia', dialCode: '+264' },
            { code: 'NE', name: 'Níger', dialCode: '+227' },
            { code: 'NG', name: 'Nigeria', dialCode: '+234' },
            { code: 'RW', name: 'Ruanda', dialCode: '+250' },
            { code: 'ST', name: 'Santo Tomé y Príncipe', dialCode: '+239' },
            { code: 'SN', name: 'Senegal', dialCode: '+221' },
            { code: 'SC', name: 'Seychelles', dialCode: '+248' },
            { code: 'SL', name: 'Sierra Leona', dialCode: '+232' },
            { code: 'SO', name: 'Somalia', dialCode: '+252' },
            { code: 'ZA', name: 'Sudáfrica', dialCode: '+27' },
            { code: 'SS', name: 'Sudán del Sur', dialCode: '+211' },
            { code: 'SD', name: 'Sudán', dialCode: '+249' },
            { code: 'SZ', name: 'Esuatini', dialCode: '+268' },
            { code: 'TZ', name: 'Tanzania', dialCode: '+255' },
            { code: 'TG', name: 'Togo', dialCode: '+228' },
            { code: 'TN', name: 'Túnez', dialCode: '+216' },
            { code: 'UG', name: 'Uganda', dialCode: '+256' },
            { code: 'ZM', name: 'Zambia', dialCode: '+260' },
            { code: 'ZW', name: 'Zimbabue', dialCode: '+263' },

            // Oceanía
            { code: 'AU', name: 'Australia', dialCode: '+61' },
            { code: 'FJ', name: 'Fiyi', dialCode: '+679' },
            { code: 'KI', name: 'Kiribati', dialCode: '+686' },
            { code: 'MH', name: 'Islas Marshall', dialCode: '+692' },
            { code: 'FM', name: 'Micronesia', dialCode: '+691' },
            { code: 'NR', name: 'Nauru', dialCode: '+674' },
            { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64' },
            { code: 'PW', name: 'Palaos', dialCode: '+680' },
            { code: 'PG', name: 'Papúa Nueva Guinea', dialCode: '+675' },
            { code: 'WS', name: 'Samoa', dialCode: '+685' },
            { code: 'SB', name: 'Islas Salomón', dialCode: '+677' },
            { code: 'TO', name: 'Tonga', dialCode: '+676' },
            { code: 'TV', name: 'Tuvalu', dialCode: '+688' },
            { code: 'VU', name: 'Vanuatu', dialCode: '+678' }
        ].sort((a, b) => a.name.localeCompare(b.name));

        // ✅ INICIALIZAR ESTAS PROPIEDADES
        this.selectedCountry = 'CO'; // Colombia por defecto
        this.phoneValue = '';
        this.showDropdown = false;

    }

    // ✅ Mejorar la función para evitar errores
    getFlagEmoji(countryCode) {
        if (!countryCode) return '🏳️'; // Bandera blanca si no hay código

        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());

        return String.fromCodePoint(...codePoints);
    }

    get currentCountry() {
        return this.countries.find(c => c.code === this.selectedCountry) || this.countries[0]; // Fallback al primero
    }

    firstUpdated() {

    }

    getPhoneNumber() {
        if (this.itiInstance) {
            return this.itiInstance.getNumber(); // Formato internacional: +573001234567
        }
        return '';
    }

    selectCountry(code) {
        this.selectedCountry = code;
        this.showDropdown = false;
    }


    isValidPhone() {
        if (this.itiInstance) {
            return this.itiInstance.isValidNumber();
        }
        return false;
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

        if (typeof this.allowinstallments === 'string') {
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

        const country = this.currentCountry;

        // ✅ Número completo
        const cleanPhone = this.phoneValue.replace(/\D/g, '');
        const fullPhone = `${country.dialCode}${cleanPhone}`;

        const data = {
            raffle_id: this.raffle,
            customer_name: formData.get('customer_name'),
            customer_email: formData.get('customer_email'),
            customer_phone: fullPhone,
            customer_address: formData.get('customer_address'),
            ticket_quantity: this.quantity,
            total_amount: this.totalPrice,
            comprobante: this.selectedFile?.file,
            send_email: true,
        };

        try {
            
            const order_create = await HandleRequest.saveOrder(data);

            

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

        const country = this.currentCountry;

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
                            <label for="customer_phone" class="block text-sm font-medium text-gray-300 mb-2">
                                Whatsapp <span class="text-red-600">*</span>
                            </label>
                            
                            <div class="relative flex gap-2">
                                
                                <!-- Selector de País -->
                                <div class="relative">
                                    <button
                                        type="button"
                                        @click=${() => this.showDropdown = !this.showDropdown}
                                        class="flex items-center gap-2 px-3 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white hover:border-red-600 transition-colors min-w-[120px]"
                                    >
                                        <span class="text-2xl">${this.getFlagEmoji(country?.code)}</span>
                                        <span class="text-sm font-medium">${country.dialCode}</span>
                                        <svg class="w-4 h-4 ml-auto transition-transform ${this.showDropdown ? 'rotate-180' : ''}" 
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </button>
                                    
                                    <!-- Dropdown -->
                                    ${this.showDropdown ? html`
                                        <div class="absolute z-50 mt-2 w-80 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                            ${this.countries.map(c => html`
                                                <button
                                                    type="button"
                                                    @click=${() => this.selectCountry(c.code)}
                                                    class="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#0f0f0f] transition-colors ${c.code === this.selectedCountry ? 'bg-red-600/10 border-l-2 border-red-600' : ''}"
                                                >
                                                    <span class="text-2xl">${this.getFlagEmoji(c.code)}</span>
                                                    <div class="flex-1 text-left">
                                                        <div class="text-white text-sm font-medium">${c.name}</div>
                                                        <div class="text-gray-400 text-xs">${c.dialCode}</div>
                                                    </div>
                                                    ${c.code === this.selectedCountry ? html`
                                                        <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                                        </svg>
                                                    ` : ''}
                                                </button>
                                            `)}
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Input -->
                                <input
                                    type="tel"
                                    id="customer_phone"
                                    name="customer_phone"
                                    required
                                    .value=${this.phoneValue}
                                    @input=${(e) => this.phoneValue = e.target.value}
                                    placeholder="3001234567"
                                    class="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                                />
                            </div>
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
                            ${this.selectedPaymentIndex === index ? html`<lucide-icon class="text-red-600 text-2xl" name="x" size="32"></lucide-icon>` : html`<img
                                class="w-full h-full object-cover"
                                loading="lazy"
                                src="${item.settings.logo_bank}"
                                srcset="${item.settings.logo_bank_src}"
                                alt="${item.settings.account_bank}"
                                aria-labelby="Button for pyment method using ${item.settings.bank}"
                            />`}
                            
                        </button>
                    ` )}
                    </div>

                    ${this.payments.map((item, index) => html`
                        ${this.selectedPaymentIndex == index ? html`
                            <div class="mb-4 p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg">
                                <div class="space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Banco:</span>
                                        <span class="text-white font-semibold">${item.settings.bank}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Tipo:</span>
                                        <div class="flex justify-end lg:justify-between! gap-x-2.5 flex-wrap">
                                            <span class="text-white font-semibold">${item.settings.type}</span>
                                            <button @click=${() => this.onCopy(item.settings.type)} type="button" class="flex gap-1 items-center cursor-pointer">
                                                <lucide-icon name="copy" size="16"></lucide-icon>
                                                <span>Copiar</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex justify-between gap-2.5 items-center">
                                        <span class="text-gray-400">Cuenta:</span>
                                        <div class="flex justify-end lg:justify-between! gap-x-2.5 flex-wrap">
                                            <span class="text-white font-semibold">${item.settings.account}</span>
                                            <button @click=${() => this.onCopy(item.settings.account)} type="button" class="flex gap-1 items-center cursor-pointer">
                                                <lucide-icon name="copy" size="16"></lucide-icon>
                                                <span>Copiar</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Titular:</span>
                                        <div class="flex justify-end lg:justify-between! gap-x-2.5 flex-wrap">
                                            <span class="text-white font-semibold">${item.settings.name}</span>
                                            <button @click=${() => this.onCopy(item.settings.name)} type="button" class="flex gap-1 items-center cursor-pointer">
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