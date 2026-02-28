// payment.js - COMPLETO
class PaymentController {
    data() {
        return {
            payments: {
                methods: []
            },
            limit: 20,
            loading: false,
            modeEdit: false,

            // Modal
            showModal: false,

            // Form
            payment: {
                id: null,
                name: '',
                account: '',
                bank: '',
                type: '',
                image: null
            },

            getQuantityMissing(){
                return this.limit -  this.payments.methods.length;
            },

            init() {

                console.log('PaymentController initialized');
                this.getAll();

                window.addEventListener('route-changed', (e) => {
                    if (e.detail.view === 'payments') {
                        this.getAll();
                    }
                });
            },

            async getAll() {
                this.loading = true;
                try {
                    const formData = new FormData();
                    formData.append('action', 'juzt_payment_methods');
                    formData.append('action_type', 'list');
                    formData.append('nonce', window.juztRaffleAdmin.nonce);
                    const response = await fetch(`${window.juztRaffleAdmin.ajaxUrl}`, {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    if (data.success) {
                        this.payments = data.data;
                    } else {
                        console.error('❌ Error al obtener métodos de pago:', data.data?.message || 'Error desconocido');
                    }
                } catch (error) {
                    console.error('Error obteniendo métodos de pago:', error);
                } finally {
                    this.loading = false;
                }
            },

            openModal() {
                this.showModal = true;
            },

            closeModal() {
                this.showModal = false;
                this.resetForm();
            },

            resetForm() {
                this.payment = {
                    id: null,
                    name: '',
                    account: '',
                    bank: '',
                    type: '',
                    image: null
                };
                this.modeEdit = false;
            },

            editPayment(payment) {
                this.payment = { ...payment };
                this.showModal = true;
                this.modeEdit = true;
            },

            async deletePayment(paymentId) {
                const allow = confirm('Desea borrar?');
                if (!allow) return false;

                if (!paymentId) {
                    alert('Id no valido');
                    return false;
                }

                const formData = new FormData();
                formData.append('action', 'juzt_payment_methods');
                formData.append('action_type', 'delete');
                formData.append('nonce', window.juztRaffleAdmin.nonce);
                formData.append('method_id', paymentId);

                const response = await fetch(window.juztRaffleAdmin.ajaxUrl, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Eliminado exitosamente');
                    this.getAll();
                    alert('Metodo de pago eliminado');
                } else {
                    console.error('❌ Error:', data.data?.message);
                    alert(data.data?.message || 'Error al guardar');
                }
            },

            async getAttachmentUrl(attachmentId) {
                if (!attachmentId) return '';

                try {
                    const response = await fetch(`${window.juztRaffleAdmin.ajaxUrl}?action=get_attachment_url&attachment_id=${attachmentId}&nonce=${window.juztRaffleAdmin.nonce}`, {
                        headers: {
                            'X-WP-Nonce': window.juztRaffleAdmin.nonce
                        }
                    });
                    const data = await response.json();
                    return data.success ? data.data.url : '';
                } catch (error) {
                    console.error('Error obteniendo URL:', error);
                    return '';
                }
            },

            async updatePayment() {
                console.log('Guardar:', this.payment);

                try {
                    const formData = new FormData();

                    // ✅ action y nonce en FormData
                    formData.append('action', 'juzt_payment_methods');
                    formData.append('action_type', 'update');
                    formData.append('nonce', window.juztRaffleAdmin.nonce);

                    // ✅ Datos del pago
                    formData.append('name', this.payment.name);
                    formData.append('account', this.payment.account);
                    formData.append('bank', this.payment.bank);
                    formData.append('type', this.payment.type);
                    formData.append('id', this.payment.id);

                    // ✅ image_id (no 'image')
                    if (this.payment.image) {
                        formData.append('image_id', this.payment.image);
                    }

                    // ✅ URL sin parámetros
                    const response = await fetch(window.juztRaffleAdmin.ajaxUrl, {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (data.success) {
                        console.log('✅ Guardado exitosamente');
                        this.closeModal();
                        this.getAll();
                        this.resetForm();
                    } else {
                        console.error('❌ Error:', data.data?.message);
                        alert(data.data?.message || 'Error al guardar');
                    }

                } catch (error) {
                    console.error('Error:', error);
                    alert('Error de conexión');
                }
            },

            async savePayment() {
                console.log('Guardar:', this.payment);

                try {
                    const formData = new FormData();

                    // ✅ action y nonce en FormData
                    formData.append('action', 'juzt_payment_methods');
                    formData.append('action_type', 'add');
                    formData.append('nonce', window.juztRaffleAdmin.nonce);

                    // ✅ Datos del pago
                    formData.append('name', this.payment.name);
                    formData.append('account', this.payment.account);
                    formData.append('bank', this.payment.bank);
                    formData.append('type', this.payment.type);

                    // ✅ image_id (no 'image')
                    if (this.payment.image) {
                        formData.append('image_id', this.payment.image);
                    }

                    // ✅ URL sin parámetros
                    const response = await fetch(window.juztRaffleAdmin.ajaxUrl, {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (data.success) {
                        console.log('✅ Guardado exitosamente');
                        this.closeModal();
                        this.getAll();
                        this.resetForm();
                    } else {
                        console.error('❌ Error:', data.data?.message);
                        alert(data.data?.message || 'Error al guardar');
                    }

                } catch (error) {
                    console.error('Error:', error);
                    alert('Error de conexión');
                }
            },

            openMediaLibrary(type = 'single', callback) {
                if (typeof wp === 'undefined' || !wp.media) {
                    alert('Media Library no disponible');
                    return;
                }

                if (typeof _ === 'undefined') {
                    console.error('❌ Underscore no está disponible');
                    alert('Error: Underscore no está cargado. Recarga la página.');
                    return;
                }

                const frame = wp.media({
                    title: type === 'single' ? 'Seleccionar imagen' : 'Seleccionar imágenes',
                    button: { text: 'Usar imágenes' },
                    multiple: type === 'gallery'
                });

                frame.on('select', () => {
                    const selection = frame.state().get('selection');

                    if (type === 'gallery') {
                        // ✅ Guardar array de objetos {id, url}
                        const attachments = [];
                        selection.each(attachment => {
                            attachments.push({
                                id: attachment.get('id'),
                                url: attachment.get('url')
                            });
                        });
                        callback(attachments);
                    } else {
                        const attachment = selection.first();
                        // ✅ Guardar objeto {id, url}
                        callback({
                            id: attachment.get('id'),
                            url: attachment.get('url')
                        });
                    }
                });

                frame.open();
            },

            selectGallery() {
                this.openMediaLibrary('single', (attachments) => {
                    console.log(attachments);
                    this.payment.image = attachments.id; // Guardar solo la URL de la imagen
                });
            },
        };
    }
}

export default PaymentController;