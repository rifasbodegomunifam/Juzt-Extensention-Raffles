<?php

return [
    'name' => 'Archive Raffle',
    'category' => 'general',
    'icon' => 'dashicons-admin-plugins',
    'description' => 'Sección de ejemplo para extensiones',
    
    'settings' => [
        'number_cols' => [
            'type' => 'number',
            'label' => 'Numero de columnas',
            'default' => 4,
        ],
        'number_posts' => [
            'type' => 'number',
            'label' => 'Numero de posts',
            'default' => 1,
        ]
    ],
    
    'blocks' => [],
];