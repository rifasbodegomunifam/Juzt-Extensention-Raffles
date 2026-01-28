<?php
if (!defined('ABSPATH')) {
    exit;
}

use Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

// Debug
error_log('=== LOADING ARCHIVE RAFFLE ===');

global $wp_query;
error_log('Posts per page from WP: ' . $wp_query->get('posts_per_page'));
error_log('Current page: ' . $wp_query->get('paged'));

// Cargar template JSON
$template_loader = new Templates();
$template_content = $template_loader->get_json_template('archive-raffle');

if (!$template_content) {
    echo '<h1>⚠️ Template not found</h1>';
    return;
}

// Setup contexto
$context = Timber::context();

// ✅ Usar el query GLOBAL (ya tiene posts_per_page correcto)
$context['posts'] = Timber::get_posts();

$context['order'] = $template_content['order'] ?? [];
$context['sections'] = $template_content['sections'] ?? [];

error_log('Posts found: ' . count($context['posts']));

// Renderizar
Timber::render('templates/index.twig', $context);