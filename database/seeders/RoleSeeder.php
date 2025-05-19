<?php

namespace Database\Seeders;

use Domain\Roles\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::truncate(); 
        $rol = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrador',
            'description' => 'Administrador de la aplicación',
            'guard_name' => 'web',
            'system' => true,
        ]);

        $rol = Role::create([
            'name' => 'user',
            'display_name' => 'Usuario',
            'description' => 'Usuario de la aplicación',
            'guard_name' => 'web',
            'system' => true,
        ]);
    }
}
