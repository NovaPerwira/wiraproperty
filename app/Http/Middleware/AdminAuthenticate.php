<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        // Not logged in → redirect to admin login
        if (!auth()->check()) {
            return redirect()->route('admin.login')
                ->with('status', 'Please sign in to access the admin area.');
        }

        // Logged in but not admin/super_admin → 403
        if (!in_array(auth()->user()->role, ['admin', 'super_admin'])) {
            abort(403, 'Access restricted to administrators.');
        }

        return $next($request);
    }
}
