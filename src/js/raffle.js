import '../css/admin.css';
import RaffleAdminApp from './modules/raffles/app';
import Alpine from 'alpinejs';

// Instanciar la aplicación (SIN router todavía)
const RaffleApp = new RaffleAdminApp();

// Exponer al window
window.RaffleAppAdmin = RaffleApp;

// ============================================
// ✅ AHORA SÍ - INICIALIZAR ROUTER
// ============================================

RaffleApp.initRouter(); // Crear el router

// ✅ REGISTRAR RUTAS (ahora el router ya existe)
RaffleApp.router.register('/dashboard', 'dashboard');
RaffleApp.router.register('/orders', 'dashboard'); // Alias

RaffleApp.router.register('/order/new', 'order-form');
RaffleApp.router.register('/order/view/:id', 'order-detail');
RaffleApp.router.register('/order/:id', 'order-detail'); // Alias
RaffleApp.router.register('/new-order', 'order-form'); // Alias

RaffleApp.router.register('/raffles', 'raffle-list');
RaffleApp.router.register('/raffle/new', 'raffle-form');
RaffleApp.router.register('/raffle/edit/:id', 'raffle-form');

RaffleApp.router.register('/payments', 'payments');

// ============================================
// CONFIGURAR ALPINE
// ============================================

window.addEventListener("alpine:init", () => {
    
    Alpine.data("RaffleAppAdmin", () => ({
        currentView: 'dashboard',
        routerParams: {},
        modal: null,
        
        init() {
            

            window.addEventListener("route-changed", (e) => {
                this.currentView = e.detail.view;
                this.routerParams = e.detail.params;
                
            });

            this.currentView = RaffleApp.router.currentRoute || "dashboard";
            this.routerParams = RaffleApp.router.params;
        },

        isView(name) {
            return this.currentView === name;
        },
        
        showView(view) {
            RaffleApp.router.navigate(`/${view}`);
        },

        initModal(){
            this.modal = RaffleApp.modal.data();
            return this.modal;
        }
    }));

    Alpine.data("RaffleAppDashboardView", () => RaffleApp.controllers.dashboard.data());
    Alpine.data("RaffleAppOrderView", () => RaffleApp.controllers.order.data());

    Alpine.data("RaffleAppPaymentsView", () => RaffleApp.controllers.payment.data());

    Alpine.data("RaffleAppRaffleListView", () => RaffleApp.controllers.raffle.listData());
    Alpine.data("RaffleAppRaffleFormView", () => RaffleApp.controllers.raffle.formData());
    Alpine.data("RaffleAppNewOrderView", () => RaffleApp.controllers.newOrder.data());

    
});

// ✅ Cuando Alpine esté completamente inicializado
document.addEventListener('alpine:initialized', () => {
    
    
    // ✅ Marcar router como listo DESPUÉS de Alpine
    RaffleApp.router.ready();
});

window.Alpine = Alpine;
Alpine.start();