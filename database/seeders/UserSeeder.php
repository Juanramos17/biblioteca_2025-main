<?php

namespace Database\Seeders;

use Domain\Permissions\Models\Permission;
use Domain\Users\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        if (!User::where('email', 'admin@example.com')->exists()) {
            $user=User::factory()->create([
                'name' => 'Test User',
                'email' => 'admin@example.com',
            ]);
            $user->syncPermissions(Permission::all()->pluck('name')->toArray());
        }




        User::factory(100)->create();

    }
}
