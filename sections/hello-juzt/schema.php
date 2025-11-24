<?php
/**
 * Schema para Hello Juzt Section
 */

return [
    'name' => 'Hello Juzt',
    'category' => 'general',
    'icon' => 'dashicons-admin-plugins',
    'description' => 'Sección de ejemplo para extensiones',
    
    'settings' => [
        'title' => [
            'type' => 'text',
            'label' => 'Título',
            'default' => 'Hello from Juzt Extension!',
        ],
        'subtitle' => [
            'type' => 'textarea',
            'label' => 'Subtítulo',
            'default' => 'This section comes from an extension',
        ],
        'background_color' => [
            'type' => 'color',
            'label' => 'Color de Fondo',
            'default' => '#6132fb',
        ],
    ],
    
    'blocks' => [],
];