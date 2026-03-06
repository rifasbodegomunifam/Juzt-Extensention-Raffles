/**
 * Dashboard Controller
 */

import { showToast } from "../../../utils/toast";

class DashboardController {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    
    data() {
        const orderModel = this.orderModel;
        
        return {
            orders: [],
            action_order: "",
            selectedOrders: [],
            loading: false,
            filters: {
                status: '',
                search: ''
            },
            
            init() {
                
                this.loadOrders();
                
                window.addEventListener('route-changed', (e) => {
                    if (e.detail.view === 'dashboard') {
                        
                        this.loadOrders();
                    }
                });
            },

            async applyOrderAction(event){
                event.preventDefault();
                if( this.action_order.trim().length === 0 ){
                    showToast("Por favor, selecciona una acción", "error");
                    return false;
                }

                if( this.selectedOrders.length === 0 ){
                    showToast("Por favor, selecciona al menos una orden", "error");
                    return false;
                }
                
                this.loading = true;
                
                try {
                    const response = await orderModel.masive(this.selectedOrders, this.action_order);
                    const message = response?.message || "Acción aplicada correctamente";
                    showToast(message, "success");
                    this.selectedOrders = [];
                    this.loadOrders();

                    
                } catch (error){
                    this.selectedOrders = [];
                    showToast("Error aplicando la acción masiva", "error");
                    console.error("❌ Error masive", error);
                } finally {
                    this.loading = false;
                }
            },

            toggleSelectAll(event) {
                if (event.target.checked) {
                    this.selectedOrders = this.filteredOrders.map(o => o.id);
                } else {
                    this.selectedOrders = [];
                }
            },
            
            async loadOrders() {
                this.loading = true;
                try {
                    this.orders = await orderModel.getAll(this.filters);
                    
                } catch (error) {
                    console.error("❌ Error cargando órdenes:", error);
                    this.orders = [];
                }
                this.loading = false;
            },
            
            viewOrder(orderId) {
                window.RaffleAppAdmin.router.navigate(`/order/view/${orderId}`);
            },
            
            filterByStatus(status) {
                this.filters.status = status;
                this.loadOrders();
            },
            
            // ✅ Computed - Filtrar órdenes
            get filteredOrders() {
                let filtered = this.orders;
                
                if (this.filters?.status) {
                    filtered = filtered.filter(o => o.status === this.filters.status);
                }
                
                if (this.filters?.search) {
                    const search = this.filters?.search.toLowerCase();
                    filtered = filtered.filter(o => 
                        o.order_number.toLowerCase().includes(search) ||
                        o.customer_name.toLowerCase().includes(search) ||
                        o.customer_email.toLowerCase().includes(search)
                    );
                }
                
                return filtered;
            },
            
            // ✅ Helper - Órdenes por estado
            getOrdersByStatus(status) {
                return this.orders.filter(o => o.status === status);
            },
            
            // Helpers para badges
            getStatusBadge(status) {
                const badges = {
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'payment_complete': 'bg-blue-100 text-blue-800',
                    'approved': 'bg-green-100 text-green-800',
                    'completed': 'bg-green-600 text-white',
                    'rejected': 'bg-red-100 text-red-800'
                };
                return badges[status] || 'bg-gray-100 text-gray-800';
            },
            
            getStatusText(status) {
                const texts = {
                    'pending': 'Pendiente',
                    'payment_complete': 'Pagos Completos',
                    'approved': 'Aprobada',
                    'completed': 'Completada',
                    'rejected': 'Rechazada'
                };
                return texts[status] || status;
            }
        };
    }
}

export default DashboardController;