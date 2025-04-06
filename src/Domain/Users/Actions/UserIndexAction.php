<?php

namespace Domain\Users\Actions;

use Domain\Users\Data\Resources\UserResource;
use Domain\Users\Models\User;

class UserIndexAction
{
    public function __invoke(?string $search = null, int $perPage = 10)
    {

        $array = explode(" ", $search);

        $s = isset($array[0]) ? $array[0] : null;
        $s2 = isset($array[1]) ? $array[1] : null;
        $s3 = isset($array[2]) ? $array[2] : null;
        
        $query = User::query()->latest(); // Preparamos la consulta base
        
        // Si se encuentra una palabra, agregamos la condición de búsqueda por nombre
        if ($s) {
            $query->where('name', 'like', "%{$s}%");
        }
        
        if ($s2) {
            $query->orWhere('name', 'like', "%{$s2}%");
        }
        
        if ($s3) {
            $query->orWhere('name', 'like', "%{$s3}%");
        }
        
        // Ejecutamos la consulta y la paginamos
        $users = $query->paginate($perPage);

        return $users->through(fn ($user) => UserResource::fromModel($user));
    }
}
