<?php

namespace Domain\Graph\Actions;

use Domain\Zones\Model\Zone;

class GraphZoneAction
{

    public function __invoke()
    {
        $topZones = Zone::with([
            'floor',
            'bookshelves.books.loans',
            'bookshelves.books.reservations' => fn($query) => $query->withTrashed()
        ])
        ->get()
        ->map(function ($zone) {
            $books = $zone->bookshelves->flatMap->books;
            $loans = $books->flatMap->loans->count();
            $reservations = $books->flatMap->reservations->count();
            return [
                'zone' => $zone->name,
                'floor' => $zone->floor->name,
                'value' => $loans + $reservations,
                'loans' => $loans,
                'reservations' => $reservations,
            ];
        })
        ->sortByDesc('value')
        ->take(10)
        ->map(function ($zone) {
            if ($zone['loans'] > 0 || $zone['reservations'] > 0) {
                return $zone;
            }
        })
        ->values()
        ->toArray();

        $topZones = array_filter($topZones);


        return $topZones;
    }
    
}