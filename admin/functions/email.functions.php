<?php

class EmailHandler {
    static public function send($email, $subject, $body){
        
        //Send emaild with wordpress function
        $send = wp_mail($email, $subject, $body);
        
        return $send;
    }

    static public function generate_email($template, $data=null){
        ob_start();
        extract($data);
        require_once(JUZT_EXTENSION_TEMPLATE_PLUGIN_DIR . "/emails/{$template}.php");
        $template = ob_get_clean();
        ob_end_flush();
        return $template;
    }
}