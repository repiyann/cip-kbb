<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
  public function run()
  {
    $admin = Role::create([
      'name' => 'admin',
      'description' => 'Administrator role with full access',
    ]);

    $user = Role::create([
      'name' => 'user',
      'description' => 'Regular user role with limited access',
    ]);

    $chatbotPermissions = [
      'view' => 'Allows viewing of chatbot conversation logs',
      'reset' => 'Allows resetting the chatbot state',
      'train' => 'Allows training the chatbot with new data',
      'interact' => 'Allows interacting with the chatbot interface',
    ];

    $rbacPermissions = [
      'manage-roles' => 'Allows managing roles',
      'manage-permissions' => 'Allows managing permissions',
      'view-roles' => 'Allows viewing roles',
      'view-permissions' => 'Allows viewing permissions',
    ];

    foreach ($chatbotPermissions as $name => $description) {
      $permission = Permission::create([
        'name' => $name,
        'description' => $description,
        'category' => 'chatbot',
        'guard_name' => 'web',
      ]);
      // Give 'admin' the permission
      $admin->givePermissionTo($permission);
    }

    // Create and assign permissions for the 'rbac' category
    foreach ($rbacPermissions as $name => $description) {
      $permission = Permission::create([
        'name' => $name,
        'description' => $description,
        'category' => 'rbac',
        'guard_name' => 'web',
      ]);
      // Give 'admin' the permission
      $admin->givePermissionTo($permission);
    }

    $user->givePermissionTo('interact');
  }
}
