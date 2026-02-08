class HandleRequest {

    static apiBase = `/wp-json/juzt-raffle-extension/frontend/v1`;

    constructor() {
        console.log("vuukd");
    }

    // request.js
    static async saveOrder(order) {
        try {
            const formData = new FormData();

            Object.keys(order).forEach(key => {
                if (key === 'comprobante' && order[key]) {
                    formData.append('comprobante', order[key]);
                } else if (order[key] !== null && order[key] !== undefined) {
                    formData.append(key, order[key]);
                }
            });

            const request = await fetch(`${this.apiBase}/save-order`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-WP-Nonce': window.JuztExtensionRaffle.nonce || ''
                }
            });

            const response = await request.json();

            // ✅ VERIFICAR SI LA RESPUESTA ES ERROR
            if (!request.ok) {
                // WordPress WP_Error structure
                throw new Error(response.message || response.data?.message || 'Error en la petición');
            }

            // ✅ O verificar el campo success
            if (!response.success) {
                throw new Error(response.message || 'Error al procesar la orden');
            }

            return response;

        } catch (error) {
            console.error('Error en saveOrder:', error);
            throw error; // Re-lanzar para que lo capture el componente
        }
    }
}

export default HandleRequest;