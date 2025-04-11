<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
  public function create(): Response
  {
    $permissions = Permission::orderBy('name', 'ASC')->get();

    return Inertia::render('dashboard/rbac/role-management', [
      'permissions' => $permissions,
    ]);
  }

  public function store(Request $request): RedirectResponse
  {
    $request->validate([
      'name' => 'required|unique:roles|min:3'
    ]);

    $role = Role::create(['name' => $request->name]);

    foreach ($request->permissions as $permission) {
      $role->givePermissionTo($permission);
    }

    return redirect()->back()->with('success', 'Role created successfully');
  }

  public function show(Request $request): Response
  {
    $role = Role::findById($request->id);

    return Inertia::render('dashboard/rbac/role-management', [
      'role' => $role,
    ]);
  }

  public function update(Request $request): RedirectResponse
  {
    $role = Role::findById($request->id);

    $request->validate([
      'name' => 'required|unique:roles|min:3'
    ]);

    $role->name = $request->name;
    $role->save();

    return redirect()->back()->with('success', 'Role updated successfully');
  }

  public function destroy(Request $request): RedirectResponse
  {
    $role = Role::findById($request->id);
    $role->delete();

    return redirect()->back()->with('success', 'Role deleted successfully');
  }
}
