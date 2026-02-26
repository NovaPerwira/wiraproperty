<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Guest::query()->withCount('bookings');

        if ($search = $request->string('search')->trim()->value()) {
            $query->search($search);
        }

        if ($request->has('blacklisted')) {
            $val = $request->string('blacklisted')->value();
            if ($val === '1') {
                $query->blacklisted();
            } elseif ($val === '0') {
                $query->notBlacklisted();
            }
        }

        $sortBy = $request->input('sort', 'created_at');
        $sortDir = $request->input('dir', 'desc');
        $allowed = ['name', 'email', 'total_bookings', 'total_spend', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $guests = $query->paginate(10)->withQueryString()
            ->through(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'email' => $g->email,
                'phone' => $g->phone,
                'nationality' => $g->nationality,
                'preferences' => $g->preferences,
                'is_blacklisted' => $g->is_blacklisted,
                'total_bookings' => $g->total_bookings,
                'total_spend' => (float) $g->total_spend,
                'created_at' => $g->created_at?->format('Y-m-d'),
            ]);

        $stats = [
            'total' => Guest::count(),
            'blacklisted' => Guest::where('is_blacklisted', true)->count(),
            'high_spend' => Guest::where('total_spend', '>=', 5000000)->count(),
        ];

        return Inertia::render('guests/index', [
            'guests' => $guests,
            'stats' => $stats,
            'filters' => $request->only(['search', 'blacklisted', 'sort', 'dir']),
        ]);
    }

    public function show(Guest $guest): Response
    {
        $bookings = $guest->bookings()
            ->with('room.roomType')
            ->latest('check_in_date')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'check_in_date' => $b->check_in_date?->format('Y-m-d'),
                'check_out_date' => $b->check_out_date?->format('Y-m-d'),
                'nights' => $b->nights,
                'status' => $b->status,
                'total_amount' => (float) $b->total_amount,
                'room_number' => $b->room?->room_number,
                'room_type' => $b->room?->roomType?->name,
                'special_requests' => $b->special_requests,
            ]);

        return Inertia::render('guests/show', [
            'guest' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'address' => $guest->address,
                'id_number' => $guest->id_number,
                'nationality' => $guest->nationality,
                'date_of_birth' => $guest->date_of_birth?->format('Y-m-d'),
                'preferences' => $guest->preferences ?? [],
                'notes' => $guest->notes,
                'is_blacklisted' => $guest->is_blacklisted,
                'blacklist_reason' => $guest->blacklist_reason,
                'total_bookings' => $guest->total_bookings,
                'total_spend' => (float) $guest->total_spend,
                'created_at' => $guest->created_at?->format('Y-m-d'),
            ],
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:guests,email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'id_number' => 'nullable|string|unique:guests,id_number|max:50',
            'nationality' => 'nullable|string|max:100',
            'date_of_birth' => 'nullable|date',
            'preferences' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        Guest::create($data);

        return redirect()->route('guests.index')->with('success', 'Tamu berhasil ditambahkan.');
    }

    public function update(Request $request, Guest $guest): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:guests,email,' . $guest->id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'nullable|string',
            'id_number' => 'nullable|string|unique:guests,id_number,' . $guest->id . '|max:50',
            'nationality' => 'nullable|string|max:100',
            'date_of_birth' => 'nullable|date',
            'preferences' => 'nullable|array',
            'notes' => 'nullable|string',
            'is_blacklisted' => 'sometimes|boolean',
            'blacklist_reason' => 'nullable|string|required_if:is_blacklisted,true',
        ]);

        $guest->update($data);

        return back()->with('success', 'Profil tamu diperbarui.');
    }

    public function destroy(Guest $guest): RedirectResponse
    {
        $guest->delete();

        return redirect()->route('guests.index')->with('success', 'Data tamu dihapus.');
    }
}
