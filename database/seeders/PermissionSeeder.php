<?php

namespace Database\Seeders;

use Domain\Permissions\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::truncate(); 

        $user_permission = Permission::create(attributes: [
            'name' => 'users.view',
            'display_name' => 'Ver Usuarios',
            'description' => 'Ver lista de Usuarios de la aplicación',
            'guard_name' => 'web',
            'parent_id' => null,
        ]);

        Permission::create(attributes: [
            'name' => 'users.create',
            'display_name' => 'Crear Usuarios',
            'description' => 'Crear Usuarios de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $user_permission->id,
        ]);

        Permission::create(attributes: [
            'name' => 'users.edit',
            'display_name' => 'Editar Usuarios',
            'description' => 'Editar Usuarios de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $user_permission->id,
        ]);

        Permission::create(attributes: [
            'name' => 'users.delete',
            'display_name' => 'Borrar Usuarios',
            'description' => 'Borrar Usuarios de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $user_permission->id,
        ]);


        $product_permission = Permission::create(attributes: [
            'name' => 'product.view',
            'display_name' => 'Ver productos',
            'description' => 'Ver lista de Productos de la aplicación',
            'guard_name' => 'web',
            'parent_id' => null,
        ]);

        Permission::create(attributes: [
            'name' => 'product.create',
            'display_name' => 'Crear Productos',
            'description' => 'Crear Productos de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $product_permission->id,
        ]);

        Permission::create(attributes: [
            'name' => 'product.edit',
            'display_name' => 'Editar Productos',
            'description' => 'Editar Productos de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $product_permission->id,
        ]);

        Permission::create(attributes: [
            'name' => 'product.delete',
            'display_name' => 'Borrar Productos',
            'description' => 'Borrar Productos de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $product_permission->id,
        ]);


        $report_permission = Permission::create(attributes: [
            'name' => 'report.view',
            'display_name' => 'Ver Reportes',
            'description' => 'Ver lista de Reportes de la aplicación',
            'guard_name' => 'web',
            'parent_id' => null,
        ]);

        Permission::create(attributes: [
            'name' => 'report.export',
            'display_name' => 'Exportar Reportes',
            'description' => 'Exportar Reportes de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $report_permission->id,
        ]);

        Permission::create(attributes: [
            'name' => 'report.print',
            'display_name' => 'Imprimir Reportes',
            'description' => 'Imprimir Reportes de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $report_permission->id,
        ]);


        $settings_permission = Permission::create(attributes: [
            'name' => 'settings.access',
            'display_name' => 'Acceder a Configuraciones',
            'description' => 'Acceder a Configuraciones de la aplicación',
            'guard_name' => 'web',
            'parent_id' => null,
        ]);

        Permission::create(attributes: [
            'name' => 'settings.modify',
            'display_name' => 'Modificar Configuraciones',
            'description' => 'Modificar Configuraciones de la aplicación',
            'guard_name' => 'web',
            'parent_id' => $settings_permission->id,
        ]);


        Cache::forever(key: 'permissions', value: Permission::whereNull('parent_id')->with('children')->get());
    }
}
