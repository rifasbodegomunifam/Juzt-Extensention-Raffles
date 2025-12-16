import { LitElement, html } from "lit";

class RaffleCountDown extends LitElement {
    static properties = {
        date: { type: String },
        days: { state: true },
        hours: { state: true },
        minutes: { state: true },
        seconds: { state: true },
        expired: { state: true },
    };

    constructor() {
        super();
        this.date = '';
        this.dateObject = null;
        this.intervalId = null;
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.expired = false;
    }

    connectedCallback() {
        super.connectedCallback();
        
        // Parsear la fecha
        if (this.date) {
            this.dateObject = new Date(this.date);
            
            // Validar fecha
            if (isNaN(this.dateObject.getTime())) {
                console.error('Invalid date format:', this.date);
                return;
            }
            
            // Calcular inicial
            this.updateCountdown();
            
            // Actualizar cada segundo
            this.intervalId = setInterval(() => {
                this.updateCountdown();
            }, 1000);
        }
    }

    updateCountdown() {
        const now = new Date().getTime();
        const targetTime = this.dateObject.getTime();
        const difference = targetTime - now;

        // Si ya expiró
        if (difference <= 0) {
            this.expired = true;
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
            
            // Detener el interval
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            
            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('countdown-expired', {
                bubbles: true,
                composed: true
            }));
            
            return;
        }

        // Calcular tiempo restante
        this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    }

    // Formato con ceros a la izquierda
    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    createRenderRoot() {
        return this;
    }

    render() {
        if (this.expired) {
            return html`
                <div class="p-4 text-center text-white bg-red-500 rounded-lg">
                    <div class="text-2xl font-bold">🎉 ¡Sorteo Finalizado!</div>
                </div>
            `;
        }

        return html`
            <div class="grid grid-cols-4 gap-2">
                <div class="p-2 text-center transition-all duration-300 rounded-lg bg-white/20 hover:bg-white/30">
                    <div class="text-2xl font-bold">${this.padZero(this.days)}</div>
                    <div class="text-xs">Días</div>
                </div>
                <div class="p-2 text-center transition-all duration-300 rounded-lg bg-white/20 hover:bg-white/30">
                    <div class="text-2xl font-bold">${this.padZero(this.hours)}</div>
                    <div class="text-xs">Hrs</div>
                </div>
                <div class="p-2 text-center transition-all duration-300 rounded-lg bg-white/20 hover:bg-white/30">
                    <div class="text-2xl font-bold">${this.padZero(this.minutes)}</div>
                    <div class="text-xs">Min</div>
                </div>
                <div class="p-2 text-center transition-all duration-300 rounded-lg bg-white/20 hover:bg-white/30 ${this.seconds < 10 ? 'animate-pulse' : ''}">
                    <div class="text-2xl font-bold">${this.padZero(this.seconds)}</div>
                    <div class="text-xs">Seg</div>
                </div>
            </div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        
        // Limpiar interval al desmontar
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

customElements.define('raffle-countdown', RaffleCountDown);