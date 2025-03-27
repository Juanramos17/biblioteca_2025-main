<?php

namespace Domain\Floors\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\FloorFactory;
use Domain\Zones\Model\Zone;


class Floor extends Model

{
    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'name',
        'ubication',
        'n_zones',
    ];
    protected static function newFactory()
    {
        return FloorFactory::new();
    }

    function zones()
    {
        return $this->hasMany('Domain\Zones\Model\Zone');
    }
}
