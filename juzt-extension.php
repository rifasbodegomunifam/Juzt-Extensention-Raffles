<?php

/**
 * Juzt Extension Registration
 * 
 * Este archivo es detectado automáticamente por Juzt Studio
 * 
 * @package Juzt_Extension_Template
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

return [
    'id' => 'juzt-extension-template', // ← Cambié de 'raffle-sections'
    'name' => 'Juzt Extension Template',
    'description' => 'Template base para crear extensiones de Juzt Studio',
    'version' => '3.0.0',
    'author' => 'JuztStack',

    // Requerimientos
    'requires' => [
        'juzt_studio' => '1.0.0',
    ],

    // Estructura consolidada (schema + twig juntos)
    'schema_location' => 'inside_sections',

    // Paths de recursos
    'paths' => [
        'snippets_dir' => __DIR__ . '/snippets',
        'sections_dir' => __DIR__ . '/sections',
        'templates_dir' => __DIR__ . '/templates',
        'assets_url' => plugin_dir_url(__FILE__) . 'assets',
        'plugin_dir' => __DIR__,
    ],

    'assets' => [
        'development' => [
            'js' => [
                'juzt-extension-template-script' => '/src/js/index.js',
            ],
            'css' => [
                'juzt-extension-template-style' => '',
            ],
        ],
        'production' => [
            'js' => [
                'juzt-extension-template-script' => '/js/index.js',
            ],
            'css' => [
                'juzt-extension-template-style' => '/css/index.css',
            ],
        ],
    ],
    'adminAssets' => [
        'development' => [
            'js' => [
                'juzt-raffle-admin-script'       => '/src/js/raffle.js'
            ],
            'css' => [
                'juzt-extension-template-style' => '',
            ],
            // ✅ NUEVO: Localize scripts
            'localize' => [
                'juzt-raffle-admin-script' => [ // ← Handle del script
                    'object_name' => 'juztRaffleAdmin',
                    'data' => [
                        'ajaxUrl' => admin_url('admin-ajax.php'),
                        'nonce' => wp_create_nonce('juzt_raffle_nonce'),
                        'adminUrl' => admin_url('admin.php?page=juzt-raffle')
                    ]
                ]
            ]
        ],
        'production' => [
            'js' => [
                'juzt-raffle-admin-script'       => '/js/raffleAdmin.js'
            ],
            'css' => [
                'juzt-extension-template-style' => '/css/raffleAdmin.css',
            ],
            // ✅ NUEVO: Localize scripts
            'localize' => [
                'juzt-raffle-admin-script' => [ // ← Handle del script
                    'object_name' => 'juztRaffleAdmin',
                    'data' => [
                        'ajaxUrl' => admin_url('admin-ajax.php'),
                        'nonce' => wp_create_nonce('juzt_raffle_nonce'),
                        'adminUrl' => admin_url('admin.php?page=juzt-raffle')
                    ]
                ]
            ]
        ],

    ],
];
