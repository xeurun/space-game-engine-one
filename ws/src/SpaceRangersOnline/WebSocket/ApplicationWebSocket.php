<?php

namespace SpaceRangersOnline\WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SpaceRangersOnline\Entity\Ship;

class ApplicationWebSocket implements MessageComponentInterface
{
    /**
     * @var \SplObjectStorage
     */
    protected $connections;

    public function __construct()
    {
        $this->connections = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $currentConnect)
    {
        var_dump(sprintf('Connect: %s', $currentConnect->resourceId));

        $this->send($currentConnect, [
            'event' => 'auth',
            'id'    => $currentConnect->resourceId
        ]);
    }

    public function onMessage(ConnectionInterface $currentConnect, $message)
    {
        var_dump(sprintf('Message: %s', $message));
        try {
            $message = json_decode($message);
            
            $answer = [
                'event' => $message->event,
                'id'    => $message->id
            ];

            switch($message->event) {
                case 'getShips':
                    $ship = new Ship($currentConnect->resourceId, $message->currentPosition, $message->nextPosition);
                    $this->connections->attach($currentConnect, $ship);

                    $ships = [];
                    foreach($this->connections as $connect) {
                        if($connect->resourceId != $currentConnect->resourceId) {
                            $connectShip = $this->connections->getInfo();
                            $ships[] = $connectShip->toArray();
                            $this->send($connect, array_merge($answer, [
                                'ship' => $ship->toArray()
                            ]));
                        }
                    }

                    $this->send($currentConnect, array_merge($answer, [
                        'id'    => $currentConnect->resourceId,
                        'ships' => $ships
                    ]));
                    break;
                case 'nextPosition':
                    foreach($this->connections as $connect) {
                        if($connect->resourceId != $currentConnect->resourceId) {
                            $this->send($connect, array_merge($answer, [
                                'nextPosition' => $message->nextPosition
                            ]));
                        } else {
                            $connectShip = $this->connections->getInfo();
                            $connectShip->setCurrentPosition($message->currentPosition);
                            $connectShip->setNextPosition($message->nextPosition);
                        }
                    }
                    break;
                case 'attack':
                    $damage = random_int(0, 100);
                    foreach($this->connections as $connect) {
                        if($connect->resourceId === $message->target) {
                            $connectShip = $this->connections->getInfo();
                            $connectShip->damage($damage);
                        }

                        $this->send($connect, array_merge($answer, [
                            'damage' => $damage,
                            'target' => $message->target
                        ]));
                    }
                    break;
                default:
                    break;
            }

        } catch(\Exception $ex) {
            var_dump($ex->getMessage() . ' in ' . $ex->getFile() . ' on '. $ex->getLine());
        }
    }

    public function onClose(ConnectionInterface $currentConnect)
    {
        var_dump(sprintf('Close: %s', $currentConnect->resourceId));
        foreach($this->connections as $connect) {
            if($connect->resourceId != $currentConnect->resourceId) {
                $this->send($connect, [
                    'event'     => 'exit',
                    'id'        => $currentConnect->resourceId,
                ]);
            }
        }
        $this->connections->detach($currentConnect);
    }

    public function onError(ConnectionInterface $currentConnect, \Exception $e)
    {
        var_dump(sprintf('Error: %s', $e->getMessage()));
        foreach($this->connections as $connect) {
            if($connect->resourceId != $currentConnect->resourceId) {
                $this->send($connect, [
                    'event'     => 'exit',
                    'id'        => $currentConnect->resourceId,
                ]);
            }
        }
        $currentConnect->close();
    }

    /**
     * @param ConnectionInterface $currentConnect
     * @param array $message
     */
    private function send(ConnectionInterface $currentConnect, array $message = [])
    {
        var_dump(sprintf('Send: %s', json_encode($message)));
        $currentConnect->send(json_encode($message));
    }
}