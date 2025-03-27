<?php

namespace Domain\Floors\Actions;

use Domain\Floors\Model\Floor;

class FloorDestroyAction
{
    public function __invoke(Floor $floor): void
    {
        $floor->delete();
    }
}
