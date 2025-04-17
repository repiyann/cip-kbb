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
    $activeTab = $request->input('activeTab', 'permissions');
    $filters = $request->only('search');

    $props = [
      'activeTab' => $activeTab,
      'filters' => $filters,
      'roles' => [],
      'permissions' => [],
      'users' => [],
    ];

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
      $props['permissions'] = Permission::orderBy('name', 'ASC')
        ->filter($filters)
        ->paginate(10)
        ->appends($request->all());
    }

    return Inertia::render('dashboard/rbac/rbac-dashboard', $props);
  }
}
