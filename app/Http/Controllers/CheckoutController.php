<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePublicBookingRequest;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Display the checkout/identity form if the room is available.
     */
    public function create(Request $request)
    {
        $request->validate([
            'room_type_id' => 'required|exists:room_types,id',
            'checkin' => 'required|date|after_or_equal:today',
            'checkout' => 'required|date|after:checkin',
            'guests' => 'required|integer|min:1',
        ]);

        $checkIn = $request->input('checkin');
        $checkOut = $request->input('checkout');
        $guests = $request->input('guests');
        $roomTypeId = $request->input('room_type_id');

        $roomType = RoomType::findOrFail($roomTypeId);

        // Explicitly fetch if any room of this type is actually available
        $availableRoomExists = Room::where('room_type_id', $roomTypeId)
            ->availableFor($checkIn, $checkOut)
            ->exists();

        if (!$availableRoomExists) {
            return redirect()->route('search.index', $request->only('checkin', 'checkout', 'guests'))
                ->withErrors(['availability' => 'Sorry, this room is no longer available for these dates.']);
        }

        return Inertia::render('checkout/index', [
            'roomType' => $roomType,
            'searchParams' => $request->only('checkin', 'checkout', 'guests', 'room_type_id')
        ]);
    }

    /**
     * Securely store the new booking ensuring no double bookings.
     */
    public function store(StorePublicBookingRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();

            $checkIn = $validated['checkin'];
            $checkOut = $validated['checkout'];

            // Re-verify availability and lock one room for this booking instance
            $room = Room::where('room_type_id', $validated['room_type_id'])
                ->availableFor($checkIn, $checkOut)
                // Uses database native lock to avoid race conditions
                ->lockForUpdate()
                ->first();

            if (!$room) {
                return back()->withErrors(['availability' => 'We are sorry! Another guest just booked the last available room of this type for these dates.']);
            }

            // Create or update the Guest record
            $guest = Guest::firstOrCreate(
                ['email' => $validated['guest_email']],
                [
                    'name' => $validated['guest_name'],
                    'phone' => $validated['guest_phone'],
                    'address' => $validated['guest_address'],
                ]
            );

            $roomType = RoomType::find($validated['room_type_id']);
            $nights = \Carbon\Carbon::parse($checkIn)->diffInDays($checkOut);
            $totalAmount = (float) $roomType->base_price * $nights;

            $booking = Booking::create([
                'room_id' => $room->id,
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'guest_address' => $guest->address,
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'status' => 'pending',
                'booking_source' => 'direct',
                'total_amount' => $totalAmount,
            ]);

            return redirect()->route('home')->with('success', 'Your booking request has been securely placed! Check your email for details.');
        });
    }
}
