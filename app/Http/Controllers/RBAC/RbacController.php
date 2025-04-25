<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Permission;
use App\Models\Role;

class RbacController extends Controller
{
  public function index(Request $request): Response
  {
    // This check the active tab in the rbac dashboard and returns the appropriate data based on the active tab
    // This is using the activeTab query parameter in the URL
    $activeTab = $request->input('activeTab', 'permissions');

    // This is using the search query parameter in the URL
    $filters = $request->only('search');

    // This is the props that will be passed to the Inertia component
    $props = [
      'activeTab' => $activeTab,
      'filters' => $filters,
      'roles' => [],
      'permissions' => [],
      'users' => [],
    ];

    // This is the logic for each active tab
    if ($activeTab === 'roles') {
      $props['roles'] = Role::with('permissions')
        ->orderBy('name', 'ASC')
        ->filter($filters)
        ->paginate(10)
        ->appends($request->all());
      $props['permissions'] = Permission::orderBy('name', 'ASC')->get();
    } elseif ($activeTab === 'users') {
      $props['roles'] = Role::orderBy('name', 'ASC')->get();
      $props['users'] = User::with('roles')
        ->orderBy('created_at', 'DESC')
        ->filter($filters)
        ->paginate(10)
        ->appends($request->all());
    } else {
      $permissions = Permission::orderBy('name', 'ASC')
        ->filter($filters)
        ->paginate(10)
        ->appends($request->all());

      $permissions->getCollection()->transform(function ($permission) {
        $permission->name = $permission->category . '.' . $permission->name;
        return $permission;
      });

      $props['permissions'] = $permissions;
    }

    // This is the Inertia component that will be rendered
    // This is the props that will be passed to the Inertia component
    return Inertia::render('dashboard/rbac/rbac-dashboard', $props);
  }
}
