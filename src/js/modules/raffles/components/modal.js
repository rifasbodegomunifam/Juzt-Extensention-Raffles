class Modal {
    constructor() {
    }

    data() {
        return {
            open: false,

            show() {
                this.open = true;
                document.body.style.overflow = 'hidden';
            },

            close() {
                this.open = false;
                document.body.style.overflow = '';
            }
        };
    }
}

export default Modal;