class RaffleController {
  constructor(raffleModel) {
    this.raffleModel = raffleModel;
  }

  /**
   * Controller para LISTA de rifas
   */
  listData() {
    const raffleModel = this.raffleModel;

    return {
      raffles: [],
      loading: false,
      search: "",
      statusFilter: "",

      async init() {
        console.log("🎟️ RaffleList inicializado");
        await this.loadRaffles();

        window.addEventListener("route-changed", (e) => {
          if (e.detail.view === "raffle-list") {
            console.log("🔄 Volviendo a lista de rifas - Recargando datos");
            this.loadRaffles();
          }
        });
      },

      async loadRaffles() {
        this.loading = true;
        try {
          this.raffles = await raffleModel.getAll();
          console.log("✅ Rifas cargadas:", this.raffles.length);
        } catch (error) {
          console.error("❌ Error cargando rifas:", error);
          this.raffles = [];
        }
        this.loading = false;
      },

      editRaffle(raffleId) {
        window.RaffleAppAdmin.router.navigate(`/raffle/edit/${raffleId}`);
      },

      createNew() {
        window.RaffleAppAdmin.router.navigate("/raffle/new");
      },

      // ✅ Nuevo método para obtener URL pública
      getRaffleUrl(raffleId) {
        // Obtener el post para conseguir el slug
        const raffle = this.raffles.find((r) => r.id === raffleId);
        if (raffle && raffle.slug) {
          return `${window.location.origin}/rifa/${raffle.slug}/`;
        }
        // Fallback: usar query param
        return `${window.location.origin}/?p=${raffleId}`;
      },

      async deleteRaffle(raffleId, raffleName) {
        if (!confirm(`¿Eliminar la rifa "${raffleName}"?`)) return;

        this.loading = true;
        try {
          const result = await raffleModel.delete(raffleId);
          if (result.success) {
            alert("Rifa eliminada exitosamente");
            await this.loadRaffles();
          } else {
            alert("Error al eliminar rifa");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error al eliminar rifa");
        }
        this.loading = false;
      },

      // Computed
      get filteredRaffles() {
        let filtered = this.raffles;

        if (this.search) {
          const search = this.search.toLowerCase();
          filtered = filtered.filter((r) =>
            r.title.toLowerCase().includes(search)
          );
        }

        if (this.statusFilter) {
          filtered = filtered.filter((r) => r.status === this.statusFilter);
        }

        return filtered;
      },

      getStatusBadge(status) {
        const badges = {
          active: "bg-green-100 text-green-800",
          paused: "bg-yellow-100 text-yellow-800",
          completed: "bg-blue-100 text-blue-800",
          cancelled: "bg-red-100 text-red-800",
        };
        return badges[status] || "bg-gray-100 text-gray-800";
      },

      getStatusText(status) {
        const texts = {
          active: "Activa",
          paused: "Pausada",
          completed: "Completada",
          cancelled: "Cancelada",
        };
        return texts[status] || status;
      },
    };
  }

  /**
   * Controller para FORMULARIO de rifa (crear/editar)
   */
  formData() {
    const raffleModel = this.raffleModel;

    return {
      // Estado inicial del formulario
      raffleInitialState: {
        id: null,
        tickets: [],
        buy_from_one: 'paused',
        title: '',
        date: '',
        content: '',
        price: 0,
        allow_installments: false,
        ticket_limit: 1000,
        gallery: [],
        prizes: [
          { title: '', description: '', image: null, imageUrl: '', detail: '', winner_number: null }
        ],
        status: 'active',

      },

      // Datos del formulario
      raffle: {
        id: null,
        tickets: [],
        buy_from_one: 'paused',
        title: '',
        date: '',
        content: '',
        price: 0,
        allow_installments: false,
        ticket_limit: 1000,
        gallery: [],
        prizes: [
          { title: '', description: '', image: null, imageUrl: '', detail: '', winner_number: null }
        ],
        status: 'active',

      },

      loading: false,
      isEditing: false,

      init() {
        console.log("📝 RaffleForm inicializado");
        this.checkAndLoadRaffle();

        window.addEventListener('route-changed', (e) => {
          if (e.detail.view === 'raffle-form') {
            console.log("🔄 Route changed en formulario:", e.detail);
            this.checkAndLoadRaffle();
          }
        });
      },

      checkAndLoadRaffle() {
        const raffleId = window.RaffleAppAdmin.router.getParam('id');
        console.log("🔍 Verificando ID de rifa:", raffleId);

        if (raffleId && raffleId !== this.raffle.id) {
          // Modo edición
          this.isEditing = true;
          this.loadRaffle(raffleId);
        } else if (!raffleId) {
          // ✅ Modo creación - Resetear formulario
          console.log("➕ Modo creación - Reseteando formulario");
          this.isEditing = false;
          this.resetForm();
        }
      },

      // ✅ Nuevo método para resetear el formulario
      resetForm() {
        this.raffle = {
          id: null,
          tickets: [],
          buy_from_one: 'paused',
          title: '',
          date: '',
          content: '',
          price: 0,
          allow_installments: false,
          ticket_limit: 1000,
          gallery: [],
          prizes: [
            { title: '', description: '', image: null, imageUrl: '', detail: '', winner_number: null }
          ],
          status: 'active',

        };
      },

      async loadRaffle(id) {
        this.loading = true;
        try {
          const data = await raffleModel.getById(id);

          console.log("HOLA", data);

          if (data) {
            this.raffle.id = data.id;
            this.raffle.buy_from_one = data.buy_from_one;
            this.raffle.title = data.title || '';
            this.raffle.date = data.date || '';
            this.raffle.content = data.content || '';
            this.raffle.price = parseFloat(data.price) || 0;
            this.raffle.allow_installments = Boolean(data.allow_installments);
            this.raffle.ticket_limit = parseInt(data.ticket_limit) || 100;
            this.raffle.status = data.status || 'active';
            this.raffle.tickets = data.numbers.tickets;

            // ✅ Manejar galería (compatibilidad con formato antiguo y nuevo)
            this.raffle.gallery = await this.processGallery(data.gallery);

            // ✅ Manejar premios
            this.raffle.prizes = await this.processPrizes(data.prizes);
          }
        } catch (error) {
          console.error("❌ Error:", error);
        }
        this.loading = false;
      },

      // ✅ Nuevo método para procesar galería
      async processGallery(gallery) {
        if (!Array.isArray(gallery) || gallery.length === 0) return [];

        const processed = [];

        for (const item of gallery) {
          if (typeof item === 'string') {
            // Formato antiguo: URL string
            processed.push({ id: null, url: item });
          } else if (typeof item === 'object' && item.id) {
            // Formato nuevo: objeto con ID
            // Si no tiene URL, obtenerla
            const url = item.url || await this.getAttachmentUrl(item.id);
            processed.push({ id: item.id, url });
          } else if (typeof item === 'number') {
            // Solo ID numérico
            const url = await this.getAttachmentUrl(item);
            processed.push({ id: item, url });
          }
        }

        return processed;
      },

      // ✅ Nuevo método para procesar premios
      async processPrizes(prizes) {
        if (!Array.isArray(prizes) || prizes.length === 0) {
          return [{ title: '', description: '', image: null, imageUrl: '', detail: '' }];
        }

        const processed = [];

        for (const prize of prizes) {
          const imageId = prize.image;
          let imageUrl = prize.imageUrl || '';

          // Si tiene ID pero no URL, obtenerla
          if (imageId && !imageUrl) {
            imageUrl = await this.getAttachmentUrl(imageId);
          }

          processed.push({
            title: prize.title || '',
            description: prize.description || '',
            image: imageId || null,
            imageUrl: imageUrl,
            detail: prize.detail || ''
          });
        }

        return processed;
      },


      async saveRaffle() {
        console.log("💾 Guardando rifa:", this.raffle);

        if (!this.raffle.title || !this.raffle.price || !this.raffle.ticket_limit) {
          alert('Por favor completa todos los campos obligatorios');
          return;
        }

        this.loading = true;

        try {
          let result;

          if (this.isEditing) {
            console.log("📝 Actualizando rifa ID:", this.raffle.id);
            result = await raffleModel.update(this.raffle.id, this.raffle);
          } else {
            console.log("➕ Creando nueva rifa");
            result = await raffleModel.create(this.raffle);
          }

          console.log("✅ Resultado:", result);

          if (result.success) {
            alert(this.isEditing ? 'Rifa actualizada exitosamente' : 'Rifa creada exitosamente');
            window.RaffleAppAdmin.router.navigate('/raffles');
          } else {
            alert('Error al guardar rifa: ' + (result.message || 'Error desconocido'));
          }
        } catch (error) {
          console.error("❌ Error:", error);
          alert('Error al guardar rifa');
        }

        this.loading = false;
      },

      addPrize() {
        this.raffle.prizes.push({
          title: '',
          description: '',
          image: '',
          detail: ''
        });
      },

      removePrize(index) {
        if (this.raffle.prizes.length > 1) {
          this.raffle.prizes.splice(index, 1);
        } else {
          alert('Debe haber al menos un premio');
        }
      },

      async getAttachmentUrl(attachmentId) {
        if (!attachmentId) return '';

        try {
          const response = await fetch(`${window.raffleAppAdmin.ajaxurl}?action=get_attachment_url&attachment_id=${attachmentId}`, {
            headers: {
              'X-WP-Nonce': window.raffleAppAdmin.nonce
            }
          });
          const data = await response.json();
          return data.success ? data.data.url : '';
        } catch (error) {
          console.error('Error obteniendo URL:', error);
          return '';
        }
      },

      openMediaLibrary(type = 'single', callback) {
        if (typeof wp === 'undefined' || !wp.media) {
          alert('Media Library no disponible');
          return;
        }

        if (typeof _ === 'undefined') {
          console.error('❌ Underscore no está disponible');
          alert('Error: Underscore no está cargado. Recarga la página.');
          return;
        }

        const frame = wp.media({
          title: type === 'single' ? 'Seleccionar imagen' : 'Seleccionar imágenes',
          button: { text: 'Usar imágenes' },
          multiple: type === 'gallery'
        });

        frame.on('select', () => {
          const selection = frame.state().get('selection');

          if (type === 'gallery') {
            // ✅ Guardar array de objetos {id, url}
            const attachments = [];
            selection.each(attachment => {
              attachments.push({
                id: attachment.get('id'),
                url: attachment.get('url')
              });
            });
            callback(attachments);
          } else {
            const attachment = selection.first();
            // ✅ Guardar objeto {id, url}
            callback({
              id: attachment.get('id'),
              url: attachment.get('url')
            });
          }
        });

        frame.open();
      },

      selectGallery() {
        this.openMediaLibrary('gallery', (attachments) => {
          this.raffle.gallery = attachments; // Array de {id, url}
        });
      },

      selectPrizeImage(index) {
        this.openMediaLibrary('single', (attachment) => {
          this.raffle.prizes[index].image = attachment.id; // ✅ Solo ID
          this.raffle.prizes[index].imageUrl = attachment.url; // Para preview
        });
      },

      removeGalleryImage(index) {
        this.raffle.gallery.splice(index, 1);
      },

      goBack() {
        window.RaffleAppAdmin.router.navigate('/raffles');
      }
    };
  }
}

export default RaffleController;
