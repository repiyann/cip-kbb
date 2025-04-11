<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RbacController extends Controller
{
  public function index(): Response
  {
    // $permissionsP = Permission::orderBy('created_at', 'DESC')->paginate();
    $permissions = Permission::all();

    // $rolesP = Role::orderBy('created_at', 'DESC')->paginate();
    // $roles = Role::all();
    $roles = Role::orderBy('name', 'ASC')->with('permissions')->get();

    return Inertia::render('dashboard/rbac/rbac-dashboard', [
      'permissions' => $permissions,
      // 'permissionsP' => $permissionsP,
      'roles' => $roles,
      // 'rolesP' => $rolesP,
    ]);
  }
}
