<?php
// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

use Juztstack\JuztStudio\Community\Templates;
use Timber\Timber;

// Cargar template JSON de la extensión
$template_loader = new Templates();
$template_content = $template_loader->get_json_template('archive-raffle');

if (!$template_content) {
    // Fallback si no se encuentra el JSON
    echo '<div style="padding: 40px; text-align: center;">';
    echo '<h1>⚠️ Template JSON not found</h1>';
    echo '<p>Could not load: archive-raffle.json</p>';
    echo '</div>';
    return;
}

// Obtener settings de la sección
$section = null;
foreach ($template_content["sections"] as $sect) {
    if ($sect["section_id"] === "archive-raffle") {
        $section = $sect;
        break;
    }
}

$posts_per_page = $section['settings']['number_posts'] ?? 12;

// Query de raffles con paginación
$paged = get_query_var('paged') ? get_query_var('paged') : 1;

$args = [
    'post_type' => 'raffle',
    'posts_per_page' => $posts_per_page,
    'paged' => $paged,
];

// Setup contexto de Timber
$context = Timber::context();

// ✅ USAR Timber::get_posts() en lugar de new PostQuery()
$context['posts'] = Timber::get_posts($args);

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
Timber::render('templates/index.twig', $context);