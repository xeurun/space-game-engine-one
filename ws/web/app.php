<?php
    require __DIR__ . '../vendor/autoload.php';

    $app = new SpaceRangersOnline\WebSocket\Application(include __DIR__ . '../app/config.php');
    
    $app->get('/', function () use ($app) {
        return $app->render('chat.phtml', [
            'user' => $app['user'],
        ]);
    })->bind('index');
    
    $app->run();