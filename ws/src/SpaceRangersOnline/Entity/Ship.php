<?php

namespace SpaceRangersOnline\Entity;

class Ship
{
    private $id;

    private $currentPosition;

    private $nextPosition;

    private $health;
    
    public function __construct($id, $currentPosition, $nextPosition)
    {
        $this->id = $id;
        $this->currentPosition = $currentPosition;
        $this->nextPosition = $nextPosition;
        $this->health = 10000;
    }

    public function toArray()
    {
        return [
            'id'                => $this->id,
            'currentPosition'   => $this->currentPosition,
            'nextPosition'      => $this->nextPosition,
            'health'            => $this->health
        ];
    }

    public function getHealth()
    {
        return $this->health;
    }

    public function setCurrentPosition($currentPosition)
    {
        return $this->currentPosition = $currentPosition;
    }

    public function setNextPosition($nextPosition)
    {
        return $this->nextPosition = $nextPosition;
    }

    public function damage($damage)
    {
        $this->health -= $damage;
    }
}