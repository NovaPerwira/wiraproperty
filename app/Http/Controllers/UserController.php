<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Super-admin only: list all admin and staff users.
     */
    public function index(): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Store a new user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:admin,staff'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => now(),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Update a user's role.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        // Protect super_admin from role changes
        if ($user->isSuperAdmin()) {
            return redirect()->route('users.index')
                ->with('error', 'Cannot change the super admin role.');
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'staff'])],
        ]);

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'User role updated successfully.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->isSuperAdmin()) {
            return redirect()->route('users.index')
                ->with('error', 'Cannot delete the super admin account.');
        }

        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
