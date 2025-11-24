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
    'version' => '1.0.0',
    'author' => 'JuztStack',

    // Requerimientos
    'requires' => [
        'juzt_studio' => '1.0.0',
    ],

    // Estructura consolidada (schema + twig juntos)
    'schema_location' => 'inside_sections',

    // Paths de recursos
    'paths' => [
        'sections_dir' => __DIR__ . '/sections',
        'templates_dir' => __DIR__ . '/templates',
        'assets_url' => plugin_dir_url(__FILE__) . 'assets',
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
                'juzt-extension-template-script' => '/js/script.js',
            ],
            'css' => [
                'juzt-extension-template-style' => '/css/style.css',
            ],
        ],
    ],
];
