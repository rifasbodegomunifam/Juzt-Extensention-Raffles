<?php

class JuztRaffleCtp
{
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        
        // ✅ Flush rewrite rules en activación del plugin
        register_activation_hook(JUZT_EXTENSION_TEMPLATE_PLUGIN_FILE, array($this, 'flush_rewrites'));
    }
    
    public function register_post_type() {
        
        $labels = array(
            'name'                  => 'Rifas',
            'singular_name'         => 'Rifa',
            'menu_name'             => 'Rifas',
            'add_new_item'          => 'Agregar Nueva Rifa',
            'edit_item'             => 'Editar Rifa',
            'view_item'             => 'Ver Rifa',
            'all_items'             => 'Todas las Rifas',
            'search_items'          => 'Buscar Rifas',
        );
        
        $args = array(
            'labels'                => $labels,
            'public'                => true,
            'publicly_queryable'    => true,
            'show_ui'               => false,
            'show_in_menu'          => false,
            'query_var'             => true,
            'rewrite'               => array(
                'slug' => 'rifas',
                'with_front' => false,
                'pages' => true, // ✅ Importante para paginación
                'feeds' => true, // ✅ Agregar esto
            ),
            'capability_type'       => 'post',
            'has_archive'           => true,
            'hierarchical'          => false,
            'supports'              => array('title', 'editor', 'thumbnail'),
            'show_in_rest'          => true,
        );
        
        register_post_type('raffle', $args);
    }
    
    // ✅ Método para flush
    public function flush_rewrites() {
        $this->register_post_type();
        flush_rewrite_rules();
    }
}