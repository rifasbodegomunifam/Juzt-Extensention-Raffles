<?php

class ExchangeApi
{

    const URL = "https://v6.exchangerate-api.com/v6/a5ad75c0a8c7c2c83c107beb/pair/%s/%s/%f";

    public function __construct() {}

    public function convert($amount, $from, $to)
    {
        $final_amount = is_string($amount) ? floatval($amount) : $amount;
        $final_url    = sprintf(self::URL, $from, $to, $final_amount);
        $response     = wp_remote_get($final_url, array());

        if (is_wp_error($response)) {
            return null;
        }

        // ✅ Decodificar JSON a objeto
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body);

        // Si prefieres array asociativo en lugar de objeto:
        // $data = json_decode($body, true);

        return $data;
    }
}
