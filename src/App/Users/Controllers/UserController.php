<?php

namespace App\Users\Controllers;

use App\Core\Controllers\Controller;
use Domain\Permissions\Models\Permission;
use Domain\Users\Actions\UserDestroyAction;
use Domain\Users\Actions\UserIndexAction;
use Domain\Users\Actions\UserStoreAction;
use Domain\Users\Actions\UserUpdateAction;
use Domain\Users\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Domain\Roles\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('users/Index');
    }

    public function create()
{
    $roles = Role::pluck('name')->toArray();

    $permissions = Permission::pluck('name')->toArray();

    $categories = array_values(array_unique(array_map(fn($p) => explode('.', $p)[0], $permissions)));

    return Inertia::render('users/Create', [
        "roles" => $roles,
        "permissions" => $permissions,
        "categories" => $categories
    ]);
}


    public function store(Request $request, UserStoreAction $action)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            "permissions" => ['nullable'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($validator->validated());

        return redirect()->route('users.index')
            ->with('success', __('messages.users.created'));
    }

    public function edit(Request $request, User $user)
    {
        $roles = Role::pluck('name')->toArray();

        $permissions = Permission::pluck('name')->toArray();

        $categories = array_values(array_unique(array_map(fn($p) => explode('.', $p)[0], $permissions)));

        $userPermissions = $user->permissions->pluck('id')->toArray(); // IDs de permisos del usuario
        $userPerm = Permission::whereIn('id', $userPermissions)->pluck('name')->toArray();

        

        return Inertia::render('users/Edit', [
            'user' => $user,
            'page' => $request->query('page'),
            'perPage' => $request->query('perPage'),
            "roles" => $roles,
            "permissions" => $permissions,
            "categories" => $categories,
            "userPermissions" => $userPerm
        ]);
    }

    public function update(Request $request, User $user, UserUpdateAction $action)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'permissions' => ['nullable'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $action($user, $validator->validated());

        $redirectUrl = route('users.index');
        
        // Añadir parámetros de página a la redirección si existen
        if ($request->has('page')) {
            $redirectUrl .= "?page=" . $request->query('page');
            if ($request->has('perPage')) {
                $redirectUrl .= "&per_page=" . $request->query('perPage');
            }
        }

        return redirect($redirectUrl)
            ->with('success', __('messages.users.updated'));
    }

    public function destroy(User $user, UserDestroyAction $action)
    {
        $action($user);

        return redirect()->route('users.index')
            ->with('success', __('messages.users.deleted'));
    }
}
