<?php

use App\Http\Controllers\RBAC\PermissionController;
use App\Http\Controllers\RBAC\RbacController;
use App\Http\Controllers\RBAC\RoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('chatbot', function () {
        return Inertia::render('dashboard/chatbot');
    })->name('chatbot');

    Route::prefix('dashboard/rbac')->group(function () {
        Route::get('/', [RbacController::class, 'index'])->name('rbac.index');

        Route::get('role/create', [RoleController::class, 'create'])->name('roles.create');

        Route::get('permissions/{id}', [PermissionController::class, 'show'])->name('permissions.show');
        Route::get('roles/{id}', [RoleController::class, 'show'])->name('roles.show');

        Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
        Route::post('roles', [RoleController::class, 'store'])->name('roles.store');

        Route::put('permissions/{id}', [PermissionController::class, 'update'])->name('permissions.update');
        Route::put('roles/{id}', [RoleController::class, 'update'])->name('roles.update');

        Route::delete('permissions/{id}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
        Route::delete('roles/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
