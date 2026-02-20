<?php
return [
    'name' => 'Main Raffle',
    'category' => 'general',
    'icon' => 'dashicons-admin-plugins',
    'settings' => [
        'layout' => [
            'type' => 'select',
            'label' => 'Layout',
            'options' => [
                'full-width' => 'Full Width',
                'divide' => 'Divide'         
            ]
        ]
    ],
    "blocks" => [
        "pyment" => [
            "name" => "Metodo de pago",
            "description" => "Registre un metodo de pago aquí",
            "settings" => [
                "logo_bank" => [
                    "type" => "file",
                    "label" => "Imagen del logo del banco"
                ],
                "account_bank" => [
                    "type" => "text",
                    "label" => "Titulo",
                    "default" => "Nombre del banco."
                ],
                "account_number" => [
                    "type" => "text",
                    "label" => "Numero de cuenta",
                    "default" => "00000000"
                ],
                "account_type" => [
                    "type" => "text",
                    "label" => "Tipo de cuenta",
                    "default" => "Ahorros"
                ],
                "account_name" => [
                    "type" => "text",
                    "label" => "Titular",
                    "default" => "Jesus"
                ]
            ]
        ]
    ]
];