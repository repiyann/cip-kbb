<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $admin = User::create([
            'name' => 'Test Admin',
            'email' => 'muhrepiyan26@gmail.com',
            'password' => bcrypt('wadaw1234'),
        ]);

        $user = User::create([
            'name' => 'Test User',
            'email' => 'waduh123@email.com',
            'password' => bcrypt('wadaw1234'),
        ]);

        $this->call([
            RolePermissionSeeder::class,
        ]);

        $admin->assignRole('admin');
        $user->assignRole('user');
    }
}
