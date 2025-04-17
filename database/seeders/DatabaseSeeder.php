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

        $user = User::create([
            'name' => 'Test User',
            'email' => 'muhrepiyan26@gmail.com',
            'password' => bcrypt('wadaw1234'),
        ]);

        $this->call([
            RolePermissionSeeder::class,
        ]);

        $user->assignRole('admin');
    }
}
