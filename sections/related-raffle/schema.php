<?php
return [
    'name' => 'Related Raffle',
    'category' => 'general',
    'icon' => 'dashicons-admin-plugins',
    'settings' => [
        'mode' => [
            'type' => 'select',
            'label' => 'Mode',
            'options' => [
                'grid' => 'Grid',
                'carousel' => 'Carousel'
            ]
        ],
        'quantity'  => [
            'type'  => 'number',
            'label' => 'Quantity',
            'min'   => 3,
            'max'   => 10
        ]
    ]
];
