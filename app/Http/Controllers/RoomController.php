<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        $rooms = Room::with('roomType')
            ->orderBy('floor')
            ->orderBy('room_number')
            ->get()
            ->map(function (Room $room) {
                return [
                    'id' => $room->id,
                    'room_number' => $room->room_number,
                    'floor' => $room->floor,
                    'status' => $room->status,          // physical
                    'display_status' => $room->display_status,  // dynamic (available/occupied/maintenance)
                    'notes' => $room->notes,
                    'room_type' => [
                        'id' => $room->roomType->id,
                        'name' => $room->roomType->name,
                        'base_price' => $room->roomType->base_price,
                        'capacity' => $room->roomType->capacity,
                        'amenities' => $room->roomType->amenities,
                    ],
                ];
            });

        $roomTypes = RoomType::orderBy('base_price')->get(['id', 'name', 'base_price', 'capacity', 'amenities']);

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            'roomTypes' => $roomTypes,
        ]);
    }

    public function store(StoreRoomRequest $request): RedirectResponse
    {
        Room::create($request->validated());

        return redirect()->route('rooms.index')
            ->with('success', 'Room created successfully.');
    }

    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:available,maintenance'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $room->update($validated);

        return back()->with('success', 'Room updated.');
    }

    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return redirect()->route('rooms.index')
            ->with('success', 'Room deleted.');
    }
}
