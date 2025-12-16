<?php

require_once JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/site/exchange-api.php";

use \Twig\Extension\AbstractExtension;
use \Twig\TwigFunction;
use \Twig\TwigFilter;

if (class_exists('Twig\Extension\AbstractExtension')) {
    class JuztRaffleExt_Timber extends AbstractExtension
    {
        public function getFunctions(): array
        {
            return [
                new TwigFunction('exchange_api_convert', [new ExchangeApi(), 'convert']),
                new TwigFunction('format_currency', [$this, 'formatCurrency']),
                new TwigFunction('format_date', [$this, 'formatDate']),
                 new TwigFunction('share_url', [$this, 'getShareUrl'])
            ];
        }

        public function formatDate($date, $format = 'd M, Y - g:i A', $locale = 'es_ES')
        {
            if (empty($date)) {
                return '';
            }

            // Parsear fecha
            $timestamp = strtotime($date);

            if ($timestamp === false) {
                return $date; // Retornar original si no se puede parsear
            }

            // Configurar locale para español
            $old_locale = setlocale(LC_TIME, 0);
            setlocale(LC_TIME, $locale, 'es_ES.UTF-8', 'Spanish_Spain', 'Spanish');

            // Meses en español (fallback si locale no funciona)
            $months_es = [
                'Jan' => 'Ene',
                'Feb' => 'Feb',
                'Mar' => 'Mar',
                'Apr' => 'Abr',
                'May' => 'May',
                'Jun' => 'Jun',
                'Jul' => 'Jul',
                'Aug' => 'Ago',
                'Sep' => 'Sep',
                'Oct' => 'Oct',
                'Nov' => 'Nov',
                'Dec' => 'Dic'
            ];

            $months_full_es = [
                'January' => 'Enero',
                'February' => 'Febrero',
                'March' => 'Marzo',
                'April' => 'Abril',
                'May' => 'Mayo',
                'June' => 'Junio',
                'July' => 'Julio',
                'August' => 'Agosto',
                'September' => 'Septiembre',
                'October' => 'Octubre',
                'November' => 'Noviembre',
                'December' => 'Diciembre'
            ];

            $days_es = [
                'Mon' => 'Lun',
                'Tue' => 'Mar',
                'Wed' => 'Mié',
                'Thu' => 'Jue',
                'Fri' => 'Vie',
                'Sat' => 'Sáb',
                'Sun' => 'Dom'
            ];

            $days_full_es = [
                'Monday' => 'Lunes',
                'Tuesday' => 'Martes',
                'Wednesday' => 'Miércoles',
                'Thursday' => 'Jueves',
                'Friday' => 'Viernes',
                'Saturday' => 'Sábado',
                'Sunday' => 'Domingo'
            ];

            // Formatear
            $formatted = date($format, $timestamp);

            // Reemplazar mes en inglés por español
            $formatted = str_replace(array_keys($months_es), array_values($months_es), $formatted);
            $formatted = str_replace(array_keys($months_full_es), array_values($months_full_es), $formatted);
            $formatted = str_replace(array_keys($days_es), array_values($days_es), $formatted);
            $formatted = str_replace(array_keys($days_full_es), array_values($days_full_es), $formatted);

            // Restaurar locale
            setlocale(LC_TIME, $old_locale);

            return $formatted;
        }

        public function getFilters(): array
        {
            return [
                new TwigFilter('currency', [$this, 'formatCurrency']),
                new TwigFilter('date_format', [$this, 'formatDate'])
            ];
        }

        /**
         * Formatear número como moneda
         * 
         * @param float $amount Monto a formatear
         * @param string $currency Código de moneda (USD, COP, VES)
         * @param int $decimals Número de decimales (default: 2)
         * @return string
         */
        public function formatCurrency($amount, $currency = 'USD', $decimals = 2)
        {
            // Convertir a float si es string
            $amount = is_string($amount) ? floatval($amount) : $amount;

            // Configuración por moneda
            $configs = [
                'USD' => ['symbol' => '$', 'decimals' => 2, 'thousands' => ',', 'decimal' => '.'],
                'COP' => ['symbol' => '$', 'decimals' => 0, 'thousands' => '.', 'decimal' => ','],
                'VES' => ['symbol' => 'Bs.', 'decimals' => 2, 'thousands' => '.', 'decimal' => ','],
                'EUR' => ['symbol' => '€', 'decimals' => 2, 'thousands' => '.', 'decimal' => ','],
            ];

            $config = $configs[strtoupper($currency)] ?? $configs['USD'];

            // Usar decimals específicos o los de la config
            $final_decimals = $decimals ?? $config['decimals'];

            // Formatear número
            $formatted = number_format(
                $amount,
                $final_decimals,
                $config['decimal'],
                $config['thousands']
            );

            return $config['symbol'] . ' ' . $formatted;
        }

        public function getShareUrl($platform, $url = '', $title = '', $description = '')
        {
            // Si no hay URL, usar la actual
            if (empty($url)) {
                $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")
                    . "://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
            }

            // Encodear parámetros
            $url_encoded = urlencode($url);
            $title_encoded = urlencode($title);
            $description_encoded = urlencode($description);
            $text = !empty($description) ? "{$title} - {$description}" : $title;
            $text_encoded = urlencode($text);

            $share_urls = [
                'facebook' => "https://www.facebook.com/sharer/sharer.php?u={$url_encoded}",

                'twitter' => "https://twitter.com/intent/tweet?url={$url_encoded}&text={$title_encoded}",

                'whatsapp' => "https://wa.me/?text={$text_encoded}%20{$url_encoded}",

                'telegram' => "https://t.me/share/url?url={$url_encoded}&text={$title_encoded}",

                'linkedin' => "https://www.linkedin.com/sharing/share-offsite/?url={$url_encoded}",

                'email' => "mailto:?subject={$title_encoded}&body={$description_encoded}%0A%0A{$url_encoded}",

                'copy' => $url, // Para copiar al portapapeles
            ];

            return $share_urls[strtolower($platform)] ?? '#';
        }
    }
}
