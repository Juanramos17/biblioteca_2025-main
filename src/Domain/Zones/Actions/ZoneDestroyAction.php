<?php

namespace Domain\Zones\Actions;

use Domain\Zones\Model\Zone;

class ZoneDestroyAction
{
    public function __invoke(Zone $zone): void
    {
        $zone->delete();
    }
}
