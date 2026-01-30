class HandleRequest {

    static apiBase = `/wp-json/juzt-raffle-extension/frontend/v1`;

    constructor() {
    }

    static async saveOrder(
        order
    ) {

        try {
            const formData = new FormData();

            Object.keys(order).forEach(key => {
                if (key === 'comprobante' && order[key]) {
                    formData.append('comprobante', order[key]); // El File object
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

            return response;
        } catch(error){
            throw new Error(error.message);
        }
        
    }
}

export default HandleRequest;