<?php

namespace Domain\Users\Actions;

use Domain\Users\Data\Resources\UserResource;
use Domain\Users\Models\User;

class UserIndexAction
{
    public function __invoke(?array $search = null, int $perPage = 10)
    {

        $search2 = $search[0];
        $name = $search[1];
        $email = $search[2];

        $user = User::query()
        ->when($search2 !== "null", function ($query) use ($search2) {
            $query->where('name', 'LIKE', '%' . $search2 . '%')
                  ->orWhere('email', 'LIKE', '%' . $search2 . '%');
        })
        ->when($name !== "null", function ($query) use ($name) {
            $query->where('name', 'LIKE', '%' . $name . '%');
        })
        ->when($email !== "null", function ($query) use ($email) {
            $query->where('email', 'LIKE', '%' . $email . '%');
        })
        ->latest()
        ->paginate($perPage);

        return $user->through(fn($user) => UserResource::fromModel($user));
    }
}
