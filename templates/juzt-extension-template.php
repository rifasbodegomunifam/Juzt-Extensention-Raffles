<?php
/**
 * Template Name: Juzt Extension Template
 * Template Post Type: page
 * Description: Template from Juzt Extension - Example template
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

use Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

// Cargar template JSON de la extensión
$template_loader = new Templates();
$template_content = $template_loader->get_json_template('juzt-extension-template');

if (!$template_content) {
    // Fallback si no se encuentra el JSON
    echo '<div style="padding: 40px; text-align: center;">';
    echo '<h1>⚠️ Template JSON not found</h1>';
    echo '<p>Could not load: juzt-extension-template.json</p>';
    echo '</div>';
    return;
}

// Setup contexto de Timber
$context = Timber::context();
$context['post'] = Timber::get_post();
$context['order'] = $template_content['order'] ?? [];
$context['sections'] = $template_content['sections'] ?? [];

// Debug (remover en producción)
if (isset($_GET['debug'])) {
    echo '<pre>';
    echo 'Template Content: ';
    print_r($template_content);
    echo '</pre>';
}

// Renderizar usando el layout del TEMA
Timber::render('templates/page.twig', $context);