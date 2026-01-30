<?php

class EmailHandler {
    static public function send($email, $subject, $body){
        
        // ✅ Configurar headers para HTML
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: Rifas Bodegom Unifam <'.get_option('admin_email').'>' // Opcional pero recomendado
        );

        //Send emaild with wordpress function
        $send = wp_mail($email, $subject, $body, $headers);
        
        return $send;
    }

    static public function generate_email($template, $data=null){
        ob_start();
        extract($data);
        require_once(JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/emails/{$template}.php");
        $template = ob_get_clean();
        //ob_end_flush();
        return $template;
    }
}