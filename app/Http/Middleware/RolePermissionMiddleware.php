<?php

namespace App\Http\Middleware;

use App\Models\Permission;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RolePermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response|RedirectResponse
    {
        $user = Auth::user();

        // get the path of the route
        $path = $request->path();

        // Explode the path into segments
        $segments = explode('/', $path); // e.g., ['dashboard', 'rbac']

        // Check if any segment matches a permission category associated with the user's roles
        $hasPermission = false;

        // Loop through each segment and check if any of them match a permission category
        foreach ($segments as $segment) {
            $hasPermission = Permission::where('category', 'like', '%' . $segment . '%')
                ->whereHas('roles', function ($query) use ($user) {
                    $query->whereIn('id', $user->roles->pluck('id'));
                })
                ->exists();

            if ($hasPermission) {
                break; // If a match is found, exit the loop early.
            }
        }

        // if user has no permission to access the route, redirect to dashboard
        if (!$hasPermission) {
            return redirect()->route('dashboard')->with('message', 'unauthorized-access-role');
        }

        // if user has permission to access the route, continue
        return $next($request);
    }
}
