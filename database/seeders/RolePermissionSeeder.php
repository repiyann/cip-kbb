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

    $permissions = [
      'view chat logs' => 'Allows viewing of chatbot conversation logs',
      'reset chatbot' => 'Allows resetting the chatbot state',
      'train chatbot' => 'Allows training the chatbot with new data',
      'interact with chatbot' => 'Allows interacting with the chatbot interface',
    ];

    foreach ($permissions as $name => $description) {
      $permission = Permission::create([
        'name' => $name,
        'description' => $description,
        'category' => 'chatbot',
        'guard_name' => 'web',
      ]);

      $admin->givePermissionTo($permission);
    }

    $user->givePermissionTo(['interact with chatbot']);
  }
}
