<?php

namespace Domain\Floors\Actions;

use Domain\Floors\Data\Resources\FloorResource;
use Domain\Floors\Model\Floor;
use Illuminate\Support\Facades\Hash;

class FloorUpdateAction
{
    public function __invoke(Floor $floor, array $data): FloorResource
    {
        $updateData = [
            'name' => $data['name'],
            'ubication' => $data['email'],
            'n_zones' => $data['n_zones'],
        ];

       

        return FloorResource::fromModel($floor->fresh());
    }
}
