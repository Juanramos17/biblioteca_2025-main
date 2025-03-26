<?php

namespace Domain\Zones\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\ZoneFactory;

class Zone extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'id',
        'name',
        'category',
        'n_bookshelves',
        'floor_id',
    ];

    protected static function newFactory()
    {
        return ZoneFactory::new();
    }

    function floor()
    {
        return $this->belongsTo('Domain\Floors\Model\Floor');
    }

    function bookshelves()
    {
        return $this->hasMany('Domain\Bookshelves\Model\Bookshelve');
    }
}
