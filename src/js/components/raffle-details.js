import { LitElement, html } from "lit";
import { tailwindStyles } from "../tailwind";


class RaffleDetails extends LitElement {

    static styles = [tailwindStyles];

    constructor(){
        super();
    }
    
    /*createRenderRoot() {
        return this; // Light DOM para Tailwind
    }*/

    render() {
        return html`
        <div class="min-h-screen py-8">
            <div class="px-4 mx-auto md:px-4 max-w-7xl">
                <div class="flex flex-col lg:flex-row! gap-6">
                    
                    <!-- Columna Izquierda -->
                    <div class="w-full lg:w-1/2 space-y-6">
                        <!-- Gallery -->
                        <div class="gallery-wrapper">
                            <slot name="gallery"></slot>
                        </div>

                        <!-- Form Mobile (solo visible en móvil) -->
                        <div class="form-mobile-wrapper block lg:hidden">
                            <slot name="form-mobile"></slot>
                        </div>

                        <!-- Meta Data -->
                        <div class="meta-data-wrapper">
                            <slot name="meta-data"></slot>
                        </div>
                    </div>

                    <!-- Columna Derecha -->
                    <div class="w-full lg:w-1/2">
                        <!-- Form Desktop (solo visible en desktop) -->
                        <div class="form-desktop-wrapper hidden lg:block">
                            <slot name="form-desktop"></slot>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        `;
    }
}

window.customElements.define("raffle-details", RaffleDetails);