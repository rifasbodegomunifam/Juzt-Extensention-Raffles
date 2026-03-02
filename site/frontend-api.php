<?php

@require_once(JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . "/functions/database.functions.php");
@require_once(JUZT_EXTENSION_TEMPLATE_PLUGIN_ADMIN_PATH . "/functions/email.functions.php");

class Frontend_API
{

    private static $instance = null;
    private $namespace = "juzt-raffle-extension/frontend/v1";

    private DbTransactionManager $db_manager;

    public static function instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function __construct()
    {
        $this->db_manager = new DbTransactionManager();
        add_action("rest_api_init", array($this, "register_routes"));
    }

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/save-order',
            [
                'methods' => 'POST',
                'callback' => [$this, 'register_order'],
                'permission_callback' => [$this, 'check_public_nonce']
            ]
        );

        register_rest_route(
            $this->namespace,
            '/save-order-test',
            [
                'methods' => 'POST',
                'callback' => [$this, 'register_order'],
                'permission_callback' => '__return_true'
            ]
        );

        register_rest_route(
            $this->namespace,
            '/test-rest',
            [
                'methods' => 'GET',
                'callback' => [$this, 'test_rest'],
                'permission_callback' => '__return_true'
            ]
        );

        register_rest_route(
            $this->namespace,
            '/upload-payment-proof',
            [
                'methods' => 'POST',
                'callback' => [$this, 'register_payment_proof'],
                'permission_callback' => [$this, 'check_public_nonce']
            ]
        );
    }

    public function register_order($request)
    {

        $order_data = array(
            'raffle_id' => $request->get_param('raffle_id'),
            'customer_name' => $request->get_param('customer_name'),
            'customer_email' => $request->get_param('customer_email'),
            'customer_phone' => $request->get_param('customer_phone'),
            'customer_address' => $request->get_param('customer_address'),
            'ticket_quantity' => $request->get_param('ticket_quantity'),
            'payment_installments' => $request->get_param('payment_installments'),
        );

        if (
            empty($order_data['raffle_id']) || empty($order_data['customer_name']) ||
            empty($order_data['customer_email']) || empty($order_data['ticket_quantity'])
        ) {
            return new WP_Error(
                'form_missing_fields',
                'Faltan campos por completar',
                array('status' => 400)
            );
        }

        $raffle_price = floatval(get_post_meta($order_data['raffle_id'], '_raffle_price', true));
        $order_data['total_amount'] = $raffle_price * $order_data['ticket_quantity'];

        $result = Juzt_Raffle_Database::get_instance()->create_order($order_data);

        if (!$result['success']) {
            return new WP_Error(
                'database_error',
                'Error al procesar orden (STP2)',
                array('status' => 400)
            );
        }

        $screenshot_url = null;

        $files = $request->get_file_params();

        if (!empty($files['comprobante'])) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');

            $uploaded = wp_handle_upload($files['comprobante'], ['test_form' => false]);

            if (!isset($uploaded['error'])) {
                $screenshot_url = $uploaded['url'];

                $payment_record = Juzt_Raffle_Database::get_instance()->upload_payment_proof(
                    $result['order_id'],
                    1,
                    $screenshot_url
                );

                if (!$payment_record) {
                    return new WP_Error('database_error', "Error al procesar orden (STP2)", ['status' => 400]);
                }

                $raffle = Juzt_Raffle_Database::get_instance()->get_raffle($order_data['raffle_id']);

                $sendEmail = $request->get_param('send_email');

                error_log("send email" . json_encode($sendEmail));

                if ($sendEmail == "false" || $sendEmail == null) {
                    return rest_ensure_response(array(
                        'success' => true,
                        'order' => $result['order_number']
                    ));
                }

                $email = EmailHandler::generate_email('order-created', [
                    "order_id" => $result["order_id"],
                    "order_number" => $result["order_number"],
                    "order_total" => $result['total_ammount'],
                    "order_quantity" => $order_data['ticket_quantity'],
                    "order_customer" => [
                        "name" => $order_data['customer_name'],
                        "email" => $order_data['customer_email'],
                        "phone" => $order_data['customer_phone'],
                    ],
                    "payment_proof" => $screenshot_url,
                    "raffle" => $raffle
                ]);

                $send = EmailHandler::send(
                    "rifaselbodegomunifam@gmail.com",
                    "Creacion de orden #{$result['order_number']}",
                    $email
                );

                $email_client = EmailHandler::generate_email('order-client-created', [
                    "order_id" => $result["order_id"],
                    "order_number" => $result["order_number"],
                    "order_total" => $result['total_ammount'],
                    "order_quantity" => $order_data['ticket_quantity'],
                    "order_customer" => [
                        "name" => $order_data['customer_name'],
                        "email" => $order_data['customer_email'],
                        "phone" => $order_data['customer_phone'],
                    ],
                    "payment_proof" => $screenshot_url,
                    "raffle" => $raffle
                ]);

                $send_to_client = EmailHandler::send(
                    $order_data['customer_email'],
                    "Creacion de orden #{$result['order_number']}",
                    $email_client
                );

                if (!$send or !$send_to_client) {
                    return new WP_Error("email_error", "Error al procesar orden (STP3)", ["status" => 400]);
                }

            } else {
                return new WP_Error('upload_error', $uploaded['error'], ['status' => 400]);
            }
        } else {
            return new WP_Error('upload_error', "Archivo no enviado", ['status' => 400]);
        }

        return rest_ensure_response(array(
            'success' => true,
            'order' => $result['order_number']
        ));
    }

    public function test_rest($request)
    {
        $send = EmailHandler::send(
            "rifaselbodegomunifam@gmail.com",
            "Test emails",
            'Emails test send'
        );

        return $send;
    }

    public function check_permission()
    {
        return current_user_can('manage_options');
    }

    // ✅ Nueva función para verificar nonce
    public function check_public_nonce($request)
    {
        $nonce = $request->get_header('X-WP-Nonce');

        if (!$nonce) {
            return new WP_Error(
                'missing_nonce',
                'Nonce requerido',
                ['status' => 403]
            );
        }

        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new WP_Error(
                'invalid_nonce',
                'Nonce inválido',
                ['status' => 403]
            );
        }

        return true;
    }

    public function register_payment_proof($request)
    {
        $step = (int) $request->get_param('step');
        $email = $request->get_param('email');

        if (empty($email) || empty($step)) {
            return new WP_Error(
                'missing_fields',
                'Faltan campos requeridos',
                ['status' => 400]
            );
        }

        if ($step === 1) {
            $orders = $this->db_manager->get_order_by_email($email);

            if (!$orders) {
                return new WP_Error(
                    'order_not_found',
                    'No se encontró una orden para este correo',
                    ['status' => 404]
                );
            }

            return rest_ensure_response($orders);
        }

        if ($step === 2) {
            $order_id = $request->get_param('order_id');

            $file = $_FILES['payment_proof'];

            if (empty($file)) {
                return new WP_Error(
                    'missing_file',
                    'Archivo de comprobante de pago es requerido',
                    ['status' => 400]
                );
            }

            // Validar tipo de archivo
            $allowed_types = array('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf');
            $file_type = $file['type'];

            if (!in_array($file_type, $allowed_types)) {
                return new WP_Error(
                    'invalid_file_type',
                    'Tipo de archivo no permitido. Solo imágenes o PDF',
                    ['status' => 400]
                );
            }

            $max_size = 5 * 1024 * 1024; // 5MB
            $file_size = $file['size'];

            if ($file_size > $max_size) {
                return new WP_Error(
                    'file_too_large',
                    'El archivo excede el tamaño máximo permitido de 5MB',
                    ['status' => 400]
                );
            }

            require_once(ABSPATH . 'wp-admin/includes/file.php');
            require_once(ABSPATH . 'wp-admin/includes/media.php');
            require_once(ABSPATH . 'wp-admin/includes/image.php');

            $db = new Juzt_Raffle_Database();

            $installments = $db->get_installments($order_id);

            if (empty($installments)) {
                return new WP_Error(
                    'installments_not_found',
                    'No se encontraron cuotas para esta orden',
                    ['status' => 404]
                );
            }

            $count = count($installments) + 1;
            $attachement_id = media_handle_upload('payment_proof', 0);

            if (is_wp_error($attachement_id)) {
                return new WP_Error(
                    'upload_error',
                    'Error al subir el archivo: ' . $attachement_id->get_error_message(),
                    ['status' => 500]
                );
            }

            // Actualizar el registro de la cuota con el ID del archivo subido
            $file_url = wp_get_attachment_url($attachement_id);
            $record_result = $db->register_payment_proof($order_id, $count, $file_url);

            if (!$record_result['success']) {
                return new WP_Error(
                    'database_error',
                    'Error al guardar el comprobante de pago en la base de datos',
                    ['status' => 500]
                );
            }

            $db->add_history(
                $order_id,
                "payment_proof_uploaded",
                "Comprobante de pago subido para la cuota #{$count}",
                json_encode([
                    'attachment_id' => $attachement_id,
                    'file_url' => $file_url,
                    'installment_number' => $count
                ]),
                'user_frontend_' . $email
            );

            return rest_ensure_response([
                'success' => true,
                'attachment_url' => $file_url,
                'message' => 'Paso 2 completado, ahora sube tu comprobante de pago'
            ]);
        }
    }

}