<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRoomRequest;
use App\Models\RoomType;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Handle the incoming search request for room availability.
     */
    public function index(SearchRoomRequest $request)
    {
        // 1. Validation passed, get safe inputs
        $validated = $request->validated();

        $checkIn = $validated['checkin'];
        $checkOut = $validated['checkout'];
        $guests = $validated['guests'];

        // 2. Optimized Server-Side Query:
        // We only want RoomTypes that satisfy the guest capacity AND have at least one room available
        // in the requested date range. We use `availableFor()` which optimally excludes rooms with overlapping bookings.
        // We also count how many rooms of each type are available so users know the limit.
        $availableRoomTypes = RoomType::query()
            ->where('capacity', '>=', $guests)
            ->whereHas('rooms', function ($query) use ($checkIn, $checkOut) {
                // Ensure there is at least 1 room available
                $query->availableFor($checkIn, $checkOut);
            })
            ->withCount([
                'rooms as available_rooms_count' => function ($query) use ($checkIn, $checkOut) {
                    // Count the exact number of available rooms for this type
                    $query->availableFor($checkIn, $checkOut);
                }
            ])
            // Only fetch what we need for the search results page
            ->get(['id', 'name', 'description', 'base_price', 'capacity', 'amenities']);

        return Inertia::render('search/index', [
            'searchParams' => $validated,
            'roomTypes' => $availableRoomTypes,
        ]);
    }
}
