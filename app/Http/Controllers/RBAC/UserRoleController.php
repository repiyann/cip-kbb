<?php

namespace App\Http\Controllers\RBAC;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserRoleController extends Controller
{
  public function update(Request $request): RedirectResponse
  {
    $user = User::findOrFail($request->id);

    if (!empty($request->roles)) {
      $user->syncRoles($request->roles);
    } else {
      $user->syncRoles([]);
    }

    return redirect()->back()->with('success', 'Role updated successfully');
  }
}
