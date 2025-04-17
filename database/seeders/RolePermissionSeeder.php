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
      'view' => 'Allows viewing of chatbot conversation logs',
      'reset' => 'Allows resetting the chatbot state',
      'train' => 'Allows training the chatbot with new data',
      'interact' => 'Allows interacting with the chatbot interface',
    ];

    foreach ($permissions as $name => $description) {
      $permission = Permission::create([
        'name' => $name,
        'description' => $description,
        'category' => 'Chats',
        'guard_name' => 'web',
      ]);

      $admin->givePermissionTo($permission);
    }

    $user->givePermissionTo(['interact']);
  }
}
