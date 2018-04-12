<?php

namespace SpaceRangersOnline\Command;

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use SpaceRangersOnline\WebSocket\ApplicationWebSocket;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class StartServerCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('websocket:server:start')
            ->setDescription('Starts the web socket servers');
    }

    /**
     * @param InputInterface  $input
     * @param OutputInterface $output
     * @return bool
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $application = new ApplicationWebSocket();
        $ws = new WsServer($application);
        $ws->disableVersion(0); // old, bad, protocol version
        $server = IoServer::factory(
            new HttpServer($ws),
            8080
        );

        $server->run();
    }
}