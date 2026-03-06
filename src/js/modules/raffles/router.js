class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.params = {};
        this.isReady = false; // ✅ Flag para indicar que está listo
        this.pendingRoute = null; // ✅ Guardar ruta pendiente
        
        // Escuchar cambios en el hash
        window.addEventListener('hashchange', () => this.handleRouteChange());
    }

    ready() {
        this.isReady = true;
        
        
        // Procesar la ruta inicial o pendiente
        this.handleRouteChange();
    }
    
    /**
     * Registrar una ruta
     * @param {string} path - Patrón de ruta ('/dashboard', '/order/view/:id')
     * @param {string} view - Nombre de la vista
     * @param {Function} handler - Función a ejecutar (opcional)
     */
    register(path, view, handler = null) {
        this.routes[path] = { view, handler };
        //
    }
    
    /**
     * Navegar a una ruta
     * @param {string} path - Ruta a navegar
     */
    navigate(path) {
        window.location.hash = path;
    }
    
    /**
     * Obtener ruta actual del hash
     */
    getCurrentPath() {
        return window.location.hash.slice(1) || '/dashboard'; // Default: dashboard
    }
    
    /**
     * Parsear parámetros de la ruta
     * Ejemplo: '/order/view/123' con patrón '/order/view/:id' → { id: 123 }
     */
    matchRoute(currentPath) {
        for (let pattern in this.routes) {
            const regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '([^/]+)') + '$');
            const match = currentPath.match(regex);
            
            if (match) {
                const keys = pattern.match(/:[^\s/]+/g) || [];
                const params = {};
                
                keys.forEach((key, index) => {
                    params[key.slice(1)] = match[index + 1];
                });
                
                return {
                    route: this.routes[pattern],
                    params
                };
            }
        }
        
        return null;
    }
    
    /**
     * Manejar cambio de ruta
     */
    handleRouteChange() {
        // ✅ Si no está listo, guardar para procesar después
        if (!this.isReady) {
            
            this.pendingRoute = this.getCurrentPath();
            return;
        }
        
        const currentPath = this.getCurrentPath();
        const matched = this.matchRoute(currentPath);
        
        if (matched) {
            this.currentRoute = matched.route.view;
            this.params = matched.params;
            
            // Ejecutar handler si existe
            if (matched.route.handler) {
                matched.route.handler(matched.params);
            }
            
            // Emitir evento para Alpine
            window.dispatchEvent(new CustomEvent('route-changed', {
                detail: {
                    view: this.currentRoute,
                    params: this.params
                }
            }));
            
            //
        } else {
            console.warn(`Ruta no encontrada: ${currentPath}`);
            this.navigate('/dashboard'); // Fallback
        }
    }
    
    /**
     * Obtener parámetro de la ruta actual
     */
    getParam(key) {
        return this.params[key];
    }
}

export default Router;