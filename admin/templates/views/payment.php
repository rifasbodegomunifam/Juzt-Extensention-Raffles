<!-- payment.php - COMPLETO -->
<div class="">
    <div class="px-4 py-2 mb-8 bg-white rounded-sm shadow-sm flex justify-between items-center">
        <h2 class="text-2xl! font-bold m-0!">Métodos de Pago</h2>
        <div class="flex items-center gap-2">
            <p class="text-lg!">Puedes registrar <span class="text-gray-700" x-text="getQuantityMissing()"></span> de
                <span class="text-blue-600" x-text="limit"></span></p>
                <template x-if="getQuantityMissing() > 0">
                    <button @click="openModal()" class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">
                        Añadir método
                    </button>
                </template>
        </div>
    </div>

    <template x-if="payments.methods.length > 0">
        <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
            <template x-for="(item, index) in payments.methods" :key="index">
                <div class="shadow-sm rounded-sm p-4 bg-white">
                    <div class="flex">
                        <template x-if="item.image">
                            <img :src="await getAttachmentUrl(item.image)" alt="Imagen del método de pago"
                                class="w-20 h-20 object-contain rounded">
                        </template>
                        <template x-if="!item.image">
                            <div class="w-20 h-20 bg-gray-100 flex items-center justify-center rounded"><span
                                    class="text-gray-400 text-sm">No hay imagen</span></div>
                        </template>

                        <div class="ml-4 flex flex-col gap-8">
                            <div>
                                <h3 class="font-bold text-lg m-0!" x-text="item.bank"></h3>
                                <p class="m-0!"><strong>Cuenta:</strong> <span x-text="item.account"></span></p>
                                <p class="m-0!"><strong>Tipo:</strong> <span x-text="item.type"></span></p>
                                <p class="m-0!"><strong>Nombre:</strong> <span x-text="item.name"></span></p>
                            </div>
                            <div class="flex gap-1">
                                <button @click="editPayment(item)"
                                    class="cursor-pointer px-2 py-1 bg-yellow-500 text-white rounded">
                                    Editar
                                </button>
                                <button @click="deletePayment(item.id)"
                                    class=" cursor-pointer px-2 py-1 bg-red-600 text-white rounded">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>

    <template x-if="payments.methods.length == 0">
        <p class="text-gray-500 text-2xl! text-center">No hay métodos de pago registrados.</p>
    </template>

</div>

<!-- MODAL -->
<div x-show="showModal" class="fixed inset-0 z-50" style="display: none;">
    <div class="fixed inset-0 bg-black/50"></div>

    <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative bg-white rounded-lg p-6 max-w-lg w-full">

            <button @click="closeModal()" class="absolute top-4 right-4 text-gray-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h2 class="text-xl font-bold mb-4" x-text="modeEdit ? 'Editar Método de Pago' : 'Nuevo Método de Pago'">
            </h2>

            <form @submit.prevent="modeEdit ? updatePayment() : savePayment()" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Banco</label>
                    <input type="text" x-model="payment.bank" class="w-full border rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Cuenta</label>
                    <input type="text" x-model="payment.account" class="w-full border rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Tipo</label>
                    <input type="text" x-model="payment.type" class="w-full border rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Nombre</label>
                    <input type="text" x-model="payment.name" class="w-full border rounded px-3 py-2">
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Imagen</label>
                    <input type="text" x-model="payment.image" class="w-full border rounded px-3 py-2"
                        accept="image/png,jpg" />
                    <div class="flex items-center gap-1">
                        <template x-if="payment.image">
                            <img :src="await getAttachmentUrl(payment.image)" alt="Imagen del método de pago"
                                class="w-16 h-16 object-cover rounded mt-2">
                        </template>
                        <template x-if="!payment.image">
                            <div class="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mt-2"><span
                                    class="text-gray-400 text-sm">No hay imagen</span></div>
                        </template>
                        <button type="button" @click="selectGallery()" class="mt-2 px-4 py-2 bg-gray-200 rounded">
                            Seleccionar desde la biblioteca
                        </button>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button type="button" @click="closeModal()" class="px-4 py-2 border rounded">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
                        Guardar
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>