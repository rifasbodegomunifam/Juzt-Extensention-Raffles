import { LitElement, html } from "lit";
import Splide from "@splidejs/splide";
import '@splidejs/splide/css';

class RaffleGallery extends LitElement {
    static properties = {
        config: { type: String },
    };

    constructor() {
        super();
        this.config = '{}';
        this.splideInstance = null;
    }

    connectedCallback() {
        super.connectedCallback();
        
        // Guardar los hijos originales antes de que Lit renderice
        this.originalChildren = Array.from(this.children);
    }

    firstUpdated() {
        // Mover los hijos al lugar correcto
        const splideList = this.querySelector('.splide__list');
        if (splideList && this.originalChildren.length > 0) {
            this.originalChildren.forEach(child => {
                splideList.appendChild(child);
            });
        }
        
        this.initSplide();
    }

    initSplide() {
        try {
            const options = JSON.parse(this.config);
            console.log('Config parseado:', options);
            
            const splideElement = this.querySelector('.splide');
            if (splideElement) {
                this.splideInstance = new Splide(splideElement, options);
                this.splideInstance.mount();
                console.log('Splide montado!');
            }
        } catch (error) {
            console.error('Error al parsear config:', error);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.splideInstance) {
            this.splideInstance.destroy();
        }
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div class="raffle-gallery rounded-xl">
                <div class="splide h-full rounded-xl">
                    <div class="splide__track h-full rounded-xl">
                        <ul class="splide__list h-full rounded-xl">
                            <!-- Los slides se agregarán aquí dinámicamente -->
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('raffle-gallery', RaffleGallery);