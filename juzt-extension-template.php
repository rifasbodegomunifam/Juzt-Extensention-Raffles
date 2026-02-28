<?php

/**
 * Plugin Name: Juzt Extension Template
 * Plugin URI: https://juztstack.com
 * Description: Template para crear extensiones de Juzt Studio Community.
 * Version: 2.8.2
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

$plugin_data = get_file_data(__FILE__, [
    'Version' => 'Version',
]);

// Definir constantes
define('JUZT_EXTENSION_TEMPLATE_VERSION', $plugin_data['Version']);
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_FILE', __FILE__);
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH', JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . '/admin');
define('JUZT_EXTENSION_TEMPLATE_PLUGIN_SITE_PATH', JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . '/site');
define('JUZT_EXTENSION_DEVELOPMENT_MODE', false); // Change to false in production


/***
 * Load request for frontend.
 */

require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_SITE_PATH . '/frontend-api.php';

/**
 * Verify that Juzt Studio is active
 */
function juzt_extension_template_check_dependencies()
{
    if (!class_exists('Juztstack\JuztStudio\Community\Core')) {
        add_action('admin_notices', function () {
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
register_activation_hook(__FILE__, function () {
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

    // Borrar opciones viejas
    delete_option('rewrite_rules');

    // Flush hard
    global $wp_rewrite;
    $wp_rewrite->init();
    flush_rewrite_rules(true);

    error_log("✅ Plugin activated and rules flushed");
});

/**
 * Limpiar cache al desactivar
 */
register_deactivation_hook(__FILE__, function () {
    error_log('🔌 Plugin deactivated: ' . plugin_basename(__FILE__));
    delete_option('rewrite_rules');
    flush_rewrite_rules(true);
});

/***
 * Admin page Raffles
 */

require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/admin/admin.config.php";


new AdminConfig();

add_action('admin_enqueue_scripts', function ($hook) {
    error_log("Current page hook: {$hook}");
});

// ✅ FORZAR TEMPLATE con template_include
add_filter('template_include', function ($template) {
    if (is_post_type_archive('raffle')) {
        $plugin_template = JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . '/templates/archive-raffle.php';

        if (file_exists($plugin_template)) {
            error_log("✅ FORCING raffle archive template: $plugin_template");

            global $wp_query;
            $wp_query->is_404 = false;
            $wp_query->is_archive = true;
            $wp_query->is_post_type_archive = true;
            status_header(200);

            return $plugin_template;
        }
    }

    return $template;
}, 999);

add_action('pre_get_posts', function ($query) {
    // Solo en frontend y main query
    if (is_admin() || !$query->is_main_query()) {
        return;
    }

    // Detectar si es URL de raffle archive
    if ($query->get('post_type') === 'raffle' && is_post_type_archive('raffle')) {
        error_log("🔍 Fixing raffle query");

        // Forzar que sea archive, no 404
        $query->is_archive = true;
        $query->is_post_type_archive = true;
        $query->is_404 = false;

        // ✅ FILTRAR POR STATUS ACTIVE
        $query->set('meta_query', [
            [
                'key'     => '_raffle_status',
                'value'   => 'active',
                'compare' => '='
            ]
        ]);

        // ✅✅✅ LEER posts_per_page del template JSON
        $template_loader = new \Juztstack\JuztStudio\Community\Templates();
        $template_content = $template_loader->get_json_template('archive-raffle');

        if ($template_content && isset($template_content['sections'])) {
            foreach ($template_content['sections'] as $section) {
                if ($section['section_id'] === 'archive-raffle' && isset($section['settings']['number_posts'])) {
                    $posts_per_page = intval($section['settings']['number_posts']);
                    $query->set('posts_per_page', $posts_per_page);

                    error_log("✅ Set posts_per_page to: $posts_per_page");
                    break;
                }
            }
        }

        error_log("✅ Query fixed");
    }
}, 1);


// 2. Registrar template para el CPT
add_filter('single_template', function ($template) {
    global $post;

    if ($post && $post->post_type === 'raffle') {
        $plugin_template = JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . '/templates/single-raffle.php';

        if (file_exists($plugin_template)) {
            error_log("✅ Loading raffle template from extension");
            return $plugin_template;
        }
    }

    return $template;
});

if (!class_exists('Timber\Timber')) {
    require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/vendor/autoload.php";
    require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/site/timber-extension.php";
}

if (class_exists('Timber\Timber')) {
    // Registrar extensión de Timber si está disponible
    add_filter('timber/twig', function ($twig) {
        $twig->addExtension(new JuztRaffleExt_Timber());
        return $twig;
    });
}

add_action('init', function () {
    if (isset($_GET['check_rules'])) {
        global $wp_rewrite;

        // ✅ Forzar generación de rules si no existen
        if ($wp_rewrite->rules === null) {
            $wp_rewrite->flush_rules(false);
        }

        echo '<h2>Rewrite Rules para Raffle:</h2><pre>';

        if (is_array($wp_rewrite->rules)) {
            $found = false;
            foreach ($wp_rewrite->rules as $pattern => $rewrite) {
                if (strpos($pattern, 'rifas') !== false || strpos($rewrite, 'raffle') !== false) {
                    echo "✅ $pattern => $rewrite\n";
                    $found = true;
                }
            }

            if (!$found) {
                echo "❌ No se encontraron reglas para 'rifas'\n";
            }
        } else {
            echo "❌ Rules array is empty or null\n";
        }

        echo '</pre>';

        echo '<h2>Post Type Raffle:</h2><pre>';
        $pt = get_post_type_object('raffle');
        if ($pt) {
            print_r($pt->rewrite);
            echo "\nHas archive: " . ($pt->has_archive ? 'YES' : 'NO') . "\n";
            echo "Publicly queryable: " . ($pt->publicly_queryable ? 'YES' : 'NO') . "\n";
        } else {
            echo "❌ Post type 'raffle' not found\n";
        }
        echo '</pre>';

        wp_die();
    }
}, 999);

add_action('init', function () {
    if (isset($_GET['hard_flush'])) {

        // Borrar opciones de rewrite
        delete_option('rewrite_rules');

        // Re-registrar post type
        $cpt = new JuztRaffleCtp();
        $cpt->register_post_type();

        // Flush rules
        global $wp_rewrite;
        $wp_rewrite->init();
        $wp_rewrite->flush_rules(true);

        echo '<h1>✅ Hard Flush Complete!</h1>';
        echo '<p><a href="/?check_rules=1">Check Rules</a></p>';
        echo '<p><a href="/rifas/">Test /rifas/</a></p>';
        echo '<p><a href="/rifas/page/2/">Test /rifas/page/2/</a></p>';

        wp_die();
    }
}, 999);

add_action('init', function () {
    add_rewrite_rule(
        '^rifas/page/?([0-9]{1,})/?$',
        'index.php?post_type=raffle&paged=$matches[1]',
        'top'
    );

    add_rewrite_rule(
        '^rifas/?$',
        'index.php?post_type=raffle',
        'top'
    );

    add_rewrite_rule(
        '^orden-completada/?$',
        'index.php?orden_completada=1',
        'top'
    );

    // Flush solo si es necesario
    $rules = get_option('rewrite_rules');
    if (!isset($rules['rifas/page/?([0-9]{1,})/?$'])) {
        flush_rewrite_rules(false);
        error_log("✅ Manual rewrite rules added");
    }
}, 10);

add_action('template_redirect', function () {
    if (get_query_var('orden_completada')) {
        
        require_once(JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . '/templates-php/order-completed.php');
        exit;
    }
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'orden_completada';
    return $vars;
});

add_action('init', function () {
    Frontend_API::instance();
}, 10);
