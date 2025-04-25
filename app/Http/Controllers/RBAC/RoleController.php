<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Http\RedirectResponse;

class RoleController extends Controller
{
  public function store(Request $request): RedirectResponse
  {
    $request->validate([
      'name' => 'required|unique:roles|min:3',
      'description' => 'required|min:3'
    ]);

    $role = Role::create([
      'name' => $request->name,
      'description' => $request->description
    ]);

    // Add permissions to role
    foreach ($request->permissions as $permission) {
      $role->givePermissionTo($permission);
    }

    return redirect()->back()->with('success', 'Role created successfully');
  }

  public function update(Request $request): RedirectResponse
  {
    $role = Role::findOrFail($request->id);

    $request->validate([
      'name' => 'required|min:3|unique:roles,name,' . $request->id . ',id',
      'description' => 'required|min:3'
    ]);

    $role->name = $request->name;
    $role->description = $request->description;
    $role->save();

    // Update permissions to role
    if (!empty($request->permissions)) {
      $role->syncPermissions($request->permissions);
    } else {
      $role->syncPermissions([]);
    }

    return redirect()->back()->with('success', 'Role updated successfully');
  }

  public function destroy(Request $request): RedirectResponse
  {
    Role::where('id', $request->id)->delete();

    return redirect()->back()->with('success', 'Role deleted successfully');
  }
}
