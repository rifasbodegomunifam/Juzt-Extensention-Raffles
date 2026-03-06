import AppRouter from './router.js';
import Store from './store.js';
import OrderController from './controller/order.js';
import DashboardController from './controller/dashboard.js';
import RaffleController from './controller/raffle.js';
import NewOrderController from './controller/order-edit.js';
import OrderModel from './model/order.js';
import RaffleModel from './model/raffle.js';
import PaymentController from './controller/payment.js';
import Modal from './components/modal.js';

class RaffleAdminApp {
    constructor() {
        // Inicializar Store
        this.store = new Store();

        this.modal = new Modal();
        
        // ⚠️ NO inicializar Router aquí todavía
        this.router = null;
        
        // Inicializar Models
        this.models = {
            order: new OrderModel(),
            raffle: new RaffleModel(),
        };
        
        // Inicializar Controllers
        this.controllers = {
            dashboard: new DashboardController(this.models.order),
            order: new OrderController(this.models.order),
            raffle: new RaffleController(this.models.raffle),
            newOrder: new NewOrderController(this.models.order, this.models.raffle),
            payment: new PaymentController(),
        };
        
        
    }
    
    // ✅ Método para inicializar router DESPUÉS de registrar rutas
    initRouter() {
        this.router = new AppRouter();
        
    }
}

export default RaffleAdminApp;