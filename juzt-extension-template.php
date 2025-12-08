<?php
/**
 * Plugin Name: Juzt Extension Template
 * Plugin URI: https://juztstack.com
 * Description: Template para crear extensiones de Juzt Studio Community.
 * Version: 2.0.0
 * Author: JuztStack
 * License: MIT
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Text Domain: juzt-extension-template
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Definir constantes
define('JUZT_EXTENSION_TEMPLATE_VERSION', '2.0.0');
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH', JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . '/admin');
define('JUZT_EXTENSION_DEVELOPMENT_MODE', false); // Change to false in production

/**
 * Verify that Juzt Studio is active
 */
function juzt_extension_template_check_dependencies() {
    if (!class_exists('Juztstack\JuztStudio\Community\Core')) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-error"><p>';
            echo '<strong>Juzt Extension Template</strong> necesita <strong>Juzt Studio Community</strong> activo.';
            echo '</p></div>';
        });
        return false;
    }
    return true;
}

/**
 * Verificar dependencias al activar
 */
register_activation_hook(__FILE__, function() {
    if (!juzt_extension_template_check_dependencies()) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die('Este plugin requiere Juzt Studio Community activo.');
    }
    
    // Limpiar cache del registry
    if (class_exists('Juztstack\JuztStudio\Community\Core')) {
        $core = \Juztstack\JuztStudio\Community\Core::get_instance();
        if ($core && isset($core->extension_registry)) {
            $core->extension_registry->clear_cache();
            error_log('✅ Registry cache cleared on activation');
        }
    }
    
    flush_rewrite_rules();
});

/**
 * Limpiar cache al desactivar
 */
register_deactivation_hook(__FILE__, function() {
    error_log('🔌 Plugin deactivated: ' . plugin_basename(__FILE__));
    flush_rewrite_rules();
});

/***
 * Admin page Raffles
 */

require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/admin/admin.config.php";

new AdminConfig();

add_action('admin_enqueue_scripts', function($hook) {
    error_log("Current page hook: {$hook}");
});