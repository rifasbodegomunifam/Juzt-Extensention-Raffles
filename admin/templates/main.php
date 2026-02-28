<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div x-data="RaffleAppAdmin()" x-cloak class="fixed inset-0 overflow-y-auto bg-gray-50 juzt-raffle-admin">
    <!-- TopBar -->
    <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/components/topbar.php'; ?>

    <!-- Contenedor Principal -->
    <main class="container px-4 py-8 pb-20 mx-auto">

        <!-- Vista: Dashboard -->
        <div x-show="currentView === 'dashboard'" x-data="RaffleAppDashboardView()" x-transition>
            <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/views/dashboard.php'; ?>
        </div>

        <!-- Vista: Detalle de Orden -->
        <div x-show="currentView === 'order-detail'" x-data="RaffleAppOrderView()" x-transition>
            <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/views/order-detail.php'; ?>
        </div>

        <!-- ✅ Vista: Nueva Orden -->
        <div x-show="currentView === 'order-form'" x-data="RaffleAppNewOrderView()" x-transition>
            <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/views/order-edit.php'; ?>
        </div>

        <!-- Vista: Lista de Rifas -->
        <div x-show="isView('raffle-list')" x-data="RaffleAppRaffleListView()" x-transition>
            <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/views/raffle-list.php'; ?>
        </div>

        <!-- Vista: Formulario de Rifa -->
        <div x-show="isView('raffle-form')" x-data="RaffleAppRaffleFormView()" x-transition>
            <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/views/raffle-edit.php'; ?>
        </div>

        <!-- Vista: Métodos de Pago -->
        <div x-show="isView('payments')" x-data="RaffleAppPaymentsView()" x-transition>
            <?php include JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . '/templates/views/payment.php'; ?>

            <!-- components/modal.php -->
            <div x-data="initModal()" x-show="open" @keydown.escape.window="close()"
                class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">

                <!-- Backdrop -->
                <div @click="close()" class="fixed inset-0 bg-black bg-opacity-50"></div>

                <!-- Modal -->
                <div class="flex min-h-screen items-center justify-center p-4">
                    <div @click.away="close()" class="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
                        x-transition>

                        <!-- Cerrar -->
                        <button @click="close()" class="absolute top-4 right-4 text-gray-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <!-- Contenido -->
                        <div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </main>
</div>


<style>
    [x-cloak] {
        display: none !important;
    }

    .juzt-raffle-admin {
        height: 100vh;
        max-height: 100vh;
    }
</style>