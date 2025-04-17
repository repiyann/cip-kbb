<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

  public function update(Request $request): RedirectResponse
  {
    $request->validate([
      'name' => 'required|min:3|unique:permissions,name,' . $request->id . ',id',
      'category' => 'required|min:3',
      'description' => 'required|min:3',
    ]);

    Permission::where('id', $request->id)->update([
      'name' => $request->name,
      'description' => $request->description,
      'category' => $request->category,
    ]);

    return redirect()->back()->with('success', 'Permission updated successfully');
  }

  public function destroy(Request $request): RedirectResponse
  {
    Permission::where('id', $request->id)->delete();

    return redirect()->back()->with('success', 'Permission deleted successfully');
  }
}
