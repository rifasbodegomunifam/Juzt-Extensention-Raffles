<?php
/**
 * Vista: Formulario de Rifa (Crear/Editar)
 */
?>

<div>
    <!-- Botón volver -->
    <button @click="goBack()" class="flex items-center mb-4 text-gray-600 transition-colors hover:text-gray-900">
        <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a rifas
    </button>

    <!-- Loading -->
    <div x-show="loading && isEditing" class="px-6 py-12 text-center bg-white rounded-lg shadow-sm">
        <svg class="mx-auto w-8 h-8 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
        </svg>
        <p class="mt-2 text-gray-600">Cargando rifa...</p>
    </div>

    <!-- Formulario -->
    <div x-show="!loading || !isEditing" class="bg-white rounded-lg shadow-sm">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">
                <span x-show="isEditing">Editar Rifa</span>
                <span x-show="!isEditing">Nueva Rifa</span>
            </h2>
            <p class="mt-1 text-sm text-gray-600">Completa todos los campos para crear/editar la rifa</p>
        </div>

        <form @submit.prevent="saveRaffle()" class="px-6 py-6">

            <!-- Información Básica -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900">Información Básica</h3>

                <!-- Título -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">
                        Título de la Rifa <span class="text-red-500">*</span>
                    </label>
                    <input type="text" x-model="raffle.title" required
                        class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Rifa iPhone 15 Pro">
                </div>

                <!-- Descripción -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">
                        Fecha de sorteo
                    </label>
                    <input type="datetime-local" x-model="raffle.date" rows="4"
                        class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe la rifa..."></textarea>
                </div>

                <!-- Date raffle -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea x-model="raffle.content" rows="4"
                        class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Una rifa genial!"></textarea>
                </div>

                <!-- Grid: Precio y Boletos -->
                <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <!-- Precio -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">
                            Precio por Boleto <span class="text-red-500">*</span>
                        </label>
                        <input type="number" x-model.number="raffle.price" required min="0" step="0.01"
                            class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="100">
                    </div>

                    <!-- Límite de boletos -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">
                            Cantidad de Boletos <span class="text-red-500">*</span>
                        </label>
                        <input type="number" x-model.number="raffle.ticket_limit" required min="1"
                            class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1000">
                        <p class="mt-1 text-xs text-gray-500">Del 000 hasta <span
                                x-text="(raffle.ticket_limit - 1).toString().padStart(3, '0')"></span></p>
                    </div>

                    <!-- Estado -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <select x-model="raffle.status"
                            class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="active">Activa</option>
                            <option value="paused">Pausada</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>

                    <!-- Estado -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">
                            Se puede activar la compra de 1 ticket
                        </label>
                        <select x-model="raffle.buy_from_one"
                            class="block px-4 py-2 mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="active">Activa</option>
                            <option value="paused">Pausada</option>
                        </select>
                    </div>
                </div>

                <!-- Permitir pagos en cuotas -->
                <div class="flex items-center">
                    <input type="checkbox" x-model="raffle.allow_installments" id="allow_installments"
                        class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
                    <label for="allow_installments" class="ml-2 text-sm text-gray-700">
                        Permitir pagar en hasta 3 cuotas
                    </label>
                </div>
            </div>

            <div class="my-8 border-t border-gray-200"></div>

            <!-- ... código anterior ... -->

            <div class="my-8 border-t border-gray-200"></div>

            <!-- Galería de Imágenes -->
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-medium text-gray-900">Galería de Imágenes</h3>
                    <button type="button" @click="selectGallery()"
                        class="px-4 py-2 text-sm text-blue-600 rounded-lg border border-blue-600 transition-colors hover:bg-blue-50">
                        <svg class="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Seleccionar Imágenes
                    </button>
                </div>

                <!-- Grid de imágenes -->
                <div x-show="raffle.gallery.length > 0" class="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <template x-for="(image, index) in raffle.gallery" :key="index">
                        <div class="relative group">
                            <img :src="typeof image === 'object' ? image.url : image" :alt="'Imagen ' + (index + 1)"
                                class="object-cover w-full h-32 rounded-lg">
                            <!-- Botón eliminar -->
                            <button type="button" @click="removeGalleryImage(index)"
                                class="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </template>
                </div>

                <!-- Estado vacío -->
                <div x-show="raffle.gallery.length === 0"
                    class="px-6 py-8 text-center rounded-lg border-2 border-gray-300 border-dashed">
                    <svg class="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">No hay imágenes en la galería</p>
                    <button type="button" @click="selectGallery()"
                        class="px-4 py-2 mt-3 text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
                        Agregar Imágenes
                    </button>
                </div>
            </div>

            <div class="my-8 border-t border-gray-200"></div>

            <!-- Premios (Repeater) -->
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900">Premios</h3>
                        <p class="text-sm text-gray-600">Define los premios de la rifa</p>
                    </div>
                    <button type="button" @click="addPrize()"
                        class="px-4 py-2 text-sm text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700">
                        <svg class="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar Premio
                    </button>
                </div>

                <!-- Lista de premios -->
                <div class="space-y-6">
                    <template x-for="(prize, index) in raffle.prizes" :key="index">
                        <div class="p-6 bg-gray-50 rounded-lg border border-gray-300">

                            <!-- Header del premio -->
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-base font-medium text-gray-900">
                                    Premio <span x-text="index + 1"></span>
                                </h4>
                                <button type="button" @click="removePrize(index)" x-show="raffle.prizes.length > 1"
                                    class="p-1 text-red-600 rounded transition-colors hover:bg-red-100">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div class="space-y-4">
                                <!-- Título del premio -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">
                                        Título del Premio
                                    </label>
                                    <input type="text" x-model="prize.title"
                                        class="block px-4 py-2 mt-1 w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ej: Primer Premio">
                                </div>

                                <!-- Descripción del premio -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">
                                        Descripción
                                    </label>
                                    <textarea x-model="prize.description" rows="3"
                                        class="block px-4 py-2 mt-1 w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe el premio..."></textarea>
                                </div>

                                <!-- Imagen del premio -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">
                                        Imagen del Premio
                                    </label>

                                    <div class="mt-2">
                                        <!-- Preview de imagen -->
                                        <div x-show="prize.image && prize.imageUrl" class="inline-block relative">
                                            <img :src="prize.imageUrl" class="object-cover w-32 h-32 rounded-lg"
                                                :alt="prize.title">
                                            <button type="button" @click="prize.image = null; prize.imageUrl = ''"
                                                class="absolute top-1 right-1 p-1 text-white bg-red-600 rounded-full hover:bg-red-700">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <!-- Botón seleccionar -->
                                        <button type="button" @click="selectPrizeImage(index)"
                                            class="px-4 py-2 text-sm text-blue-600 rounded-lg border border-blue-600 transition-colors hover:bg-blue-50"
                                            :class="{ 'mt-2': prize.image || prize.imageUrl }">
                                            <svg class="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span x-text="prize.image ? 'Cambiar Imagen' : 'Seleccionar Imagen'"></span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Detalle adicional -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">
                                        Detalle Adicional
                                    </label>
                                    <input type="text" x-model="prize.detail"
                                        class="block px-4 py-2 mt-1 w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ej: Incluye funda y audífonos">
                                </div>

                                <button x-show="prize.winner_number != null" class="rounded-md py-2 px-0 bg-red-600 text-white hover:bg-red-500 transition-all text-center w-full cursor-pointer" type="button" @click="prize.winner_number = null">Quitar numero ganador</button>

                                <!-- En la sección de cada premio, reemplazar el selector de números -->
                                <div x-data="{
    searchNumber: '',
    currentPage: 1,
    perPage: 50,
    
    get filteredTickets() {
        if (!this.searchNumber) return raffle.tickets;
        return raffle.tickets.filter(ticket => 
            ticket.number.includes(this.searchNumber)
        );
    },
    
    get totalPages() {
        return Math.ceil(this.filteredTickets?.length / this.perPage);
    },
    
    get paginatedTickets() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.filteredTickets?.slice(start, end);
    },
    
    get pageNumbers() {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    },
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    },
    
    resetPagination() {
        this.currentPage = 1;
    }
}">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Seleccionar número ganador de este premio
                                    </label>

                                    <!-- Buscador -->
                                    <div class="mb-4">
                                        <div class="relative">
                                            <input type="text" x-model="searchNumber" @input="resetPagination()"
                                                placeholder="Buscar número..."
                                                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                            
                                        </div>

                                        <!-- Contador de resultados -->
                                        <p class="mt-2 text-sm text-gray-600">
                                            <span x-show="!searchNumber">
                                                Mostrando <span x-text="paginatedTickets.length"></span> de <span
                                                    x-text="raffle.tickets.length"></span> números vendidos
                                            </span>
                                            <span x-show="searchNumber">
                                                Encontrados: <span x-text="filteredTickets.length"></span> números
                                            </span>
                                        </p>
                                    </div>

                                    <!-- Grid de números -->
                                    <div
                                        class="overflow-auto max-h-96 w-full bg-gray-50 p-3 rounded-lg border border-gray-200">

                                        <!-- Mensaje cuando no hay resultados -->
                                        <div x-show="filteredTickets.length === 0" class="text-center py-8">
                                            <svg class="mx-auto w-12 h-12 text-gray-400" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p class="mt-2 text-gray-600">No se encontraron números</p>
                                            <button type="button" @click="searchNumber = ''"
                                                class="mt-2 text-sm text-blue-600 hover:text-blue-700">
                                                Limpiar búsqueda
                                            </button>
                                        </div>

                                        <!-- Grid de números paginados -->
                                        <div x-show="paginatedTickets.length > 0"
                                            class="grid gap-2 grid-cols-5 md:grid-cols-10">
                                            <template x-for="(ticket, index) in paginatedTickets" :key="ticket.number">
                                                <label
                                                    class="flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                                                    :class="{
                        'border-blue-600 bg-blue-100 shadow-md': prize.winner_number === ticket.number,
                        'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50': prize.winner_number !== ticket.number
                    }">
                                                    <input type="radio" :name="'winner_number_' + index"
                                                        :value="ticket.number" x-model="prize.winner_number"
                                                        class="sr-only" />

                                                    <!-- Checkmark cuando está seleccionado -->
                                                    <svg x-show="prize.winner_number === ticket.number"
                                                        class="absolute top-1 right-1 w-4 h-4 text-blue-600"
                                                        fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clip-rule="evenodd" />
                                                    </svg>

                                                    <span x-text="ticket.number" class="font-mono font-bold text-sm"
                                                        :class="prize.winner_number === ticket.number ? 'text-blue-700' : 'text-gray-700'"></span>
                                                </label>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- Paginación -->
                                    <div x-show="totalPages > 1 && filteredTickets.length > 0"
                                        class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">

                                        <!-- Botón anterior -->
                                        <button type="button" @click="goToPage(currentPage - 1)"
                                            :disabled="currentPage === 1"
                                            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <!-- Números de página -->
                                        <div class="flex gap-1">
                                            <!-- Primera página -->
                                            <button x-show="pageNumbers[0] > 1" type="button" @click="goToPage(1)"
                                                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                                1
                                            </button>

                                            <span x-show="pageNumbers[0] > 2" class="px-2 py-2 text-gray-500">...</span>

                                            <!-- Páginas visibles -->
                                            <template x-for="page in pageNumbers" :key="page">
                                                <button type="button" @click="goToPage(page)"
                                                    class="px-3 py-2 text-sm font-medium rounded-lg" :class="{
                        'bg-blue-600 text-white': currentPage === page,
                        'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50': currentPage !== page
                    }" x-text="page"></button>
                                            </template>

                                            <span x-show="pageNumbers[pageNumbers.length - 1] < totalPages - 1"
                                                class="px-2 py-2 text-gray-500">...</span>

                                            <!-- Última página -->
                                            <button x-show="pageNumbers[pageNumbers.length - 1] < totalPages"
                                                type="button" @click="goToPage(totalPages)"
                                                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                x-text="totalPages"></button>
                                        </div>

                                        <!-- Botón siguiente -->
                                        <button type="button" @click="goToPage(currentPage + 1)"
                                            :disabled="currentPage === totalPages"
                                            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- Info de paginación -->
                                    <p x-show="totalPages > 1" class="mt-2 text-xs text-center text-gray-500">
                                        Página <span x-text="currentPage"></span> de <span x-text="totalPages"></span>
                                    </p>

                                    <!-- Número seleccionado -->
                                    <div x-show="prize.winner_number"
                                        class="mt-4 p-3 bg-green-50 border border-green-500 rounded-lg">
                                        <p class="text-sm text-green-700">
                                            Número ganador: <span x-text="prize.winner_number"
                                                class="font-mono font-bold text-lg"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </template>
                </div>
            </div>

            <div class="my-8 border-t border-gray-200"></div>

            <!-- Botones de acción -->
            <div class="flex justify-end space-x-4">
                <button type="button" @click="goBack()"
                    class="px-6 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-50">
                    Cancelar
                </button>
                <button type="submit" :disabled="loading"
                    class="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg x-show="loading" class="inline-block mr-2 w-4 h-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span x-show="isEditing">Actualizar Rifa</span>
                    <span x-show="!isEditing">Crear Rifa</span>
                </button>
            </div>

        </form>
    </div>
</div>