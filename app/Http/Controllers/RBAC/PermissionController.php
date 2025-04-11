<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;

class PermissionController extends Controller
{
  public function store(Request $request): RedirectResponse
  {
    $request->validate([
      'name' => 'required|unique:permissions|min:3',
      'category' => 'required|min:3',
      'description' => 'required|min:3',
    ]);

    Permission::create([
      'name' => $request->name,
      'category' => $request->category,
      'description' => $request->description,
    ]);

    return redirect()->back()->with('success', 'Permission created successfully');
  }

  public function show(Request $request): Response
  {
    $permission = Permission::findById($request->id);

    return Inertia::render('dashboard/rbac/rbac-dashboard', [
      'permission' => $permission,
    ]);
  }

  public function update(Request $request): RedirectResponse
  {
    $permission = Permission::findById($request->id);

    $request->validate([
      'name' => 'required|unique:permissions|min:3',
      'category' => 'required|min:3',
      'description' => 'required|min:3',
    ]);

    $permission->name = $request->name;
    $permission->save();

    return redirect()->back()->with('success', 'Permission updated successfully');
  }

  public function destroy(Request $request): RedirectResponse
  {
    $permission = Permission::findById($request->id);
    $permission->delete();

    return redirect()->back()->with('success', 'Permission deleted successfully');
  }
}
