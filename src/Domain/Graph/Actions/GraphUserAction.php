<?php

namespace Domain\Graph\Actions;

use Domain\Users\Models\User;

class GraphUserAction
{

    public function __invoke()
    {
        $topUsers = User::with(['loans', 'reservations' => fn($query) => $query->withTrashed()])
        ->get()
        ->map(function ($user) {
            $loans = $user->loans->count();
            $reservations = $user->reservations->count();
            return [
                'name' => $user->name,
                'value' => $loans + $reservations,
                'loans' => $loans,
                'reservations' => $reservations,
            ];
        })
        ->sortByDesc('value')
        ->take(10)
        ->values()
        ->toArray();

        return $topUsers;
    }
    
}