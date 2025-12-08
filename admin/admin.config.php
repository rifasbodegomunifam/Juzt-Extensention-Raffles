<?php

require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . "/functions/database.functions.php";
require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . "/functions/ajax.functions.php";

class AdminConfig
{
    public function __construct()
    {
        add_action('admin_enqueue_scripts', [$this, 'addMediaLibrary']);
        add_action('admin_head', [$this, 'addStyleForAdmin']);
        add_action('admin_menu', [$this, 'addAdminPage']);
    }

    public function addMediaLibrary($hook)
    {
        if ($hook === 'toplevel_page_juzt-raffle') {
            // ✅ Cargar Media Library de WordPress
            wp_enqueue_media();
        }
    }

    public function addAdminPage()
    {
        add_menu_page('Juzt Raffle', 'Juzt Raffle', 'manage_options', 'juzt-raffle', [$this, 'renderAdminPage'], 'dashicons-tickets-alt', 3);
    }

    public function renderAdminPage()
    {
        require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . "/templates/main.php";
    }

    public function addStyleForAdmin()
    {
        $screen = get_current_screen();

        if ($screen && $screen->id === 'toplevel_page_juzt-raffle') {
?>
            <style>
                /* Ocultar menú lateral y admin bar */
                #adminmenumain,
                #wpadminbar,
                #wpfooter {
                    display: none !important;
                }

                /* Ajustar contenedor principal */
                #wpcontent {
                    margin-left: 0 !important;
                    padding-left: 0 !important;
                }

                #wpbody,
                #wpbody-content {
                    padding: 0 !important;
                    padding-top: 0 !important;
                }

                /* Fullscreen */
                html.wp-toolbar {
                    padding-top: 0 !important;
                }
            </style>
<?php
        }
    }
}
