<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::query()
            ->with('room.roomType')
            ->latest();

        if ($search = $request->string('search')->trim()->value()) {
            $query->search($search);
        }
        if ($status = $request->string('status')->trim()->value()) {
            $query->byStatus($status);
        }
        if ($source = $request->string('source')->trim()->value()) {
            $query->bySource($source);
        }
        if ($from = $request->string('date_from')->trim()->value()) {
            $query->where('check_in_date', '>=', $from);
        }
        if ($to = $request->string('date_to')->trim()->value()) {
            $query->where('check_in_date', '<=', $to);
        }

        $bookings = $query->paginate(15)->withQueryString()
            ->through(fn($b) => [
                'id' => $b->id,
                'guest_name' => $b->guest_name,
                'guest_email' => $b->guest_email,
                'guest_phone' => $b->guest_phone,
                'guest_address' => $b->guest_address,
                'check_in_date' => $b->check_in_date?->format('Y-m-d'),
                'check_out_date' => $b->check_out_date?->format('Y-m-d'),
                'nights' => $b->nights,
                'status' => $b->status,
                'booking_source' => $b->booking_source,
                'total_amount' => $b->total_amount,
                'special_requests' => $b->special_requests,
                'room' => $b->room ? [
                    'id' => $b->room->id,
                    'room_number' => $b->room->room_number,
                    'room_type' => $b->room->roomType?->name,
                ] : null,
            ]);

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'status', 'source', 'date_from', 'date_to']),
        ]);
    }

    public function create(): Response
    {
        $rooms = Room::with('roomType')
            ->where('status', 'available')
            ->orderBy('floor')->orderBy('room_number')
            ->get(['id', 'room_number', 'floor', 'room_type_id'])
            ->map(fn($r) => [
                'id' => $r->id,
                'room_number' => $r->room_number,
                'floor' => $r->floor,
                'room_type' => $r->roomType?->name,
                'base_price' => (float) $r->roomType?->base_price,
            ]);

        return Inertia::render('bookings/create', [
            'rooms' => $rooms,
        ]);
    }

    public function store(StoreBookingRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();

        Booking::create($data);

        return redirect()->route('bookings.index')
            ->with('success', 'Booking created successfully.');
    }

    public function update(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $booking->update($request->validated());

        return back()->with('success', 'Booking status updated.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Booking deleted.');
    }

    /**
     * Calendar data endpoint — returns all bookings for a given month/year
     * with room info, formatted for the Gantt occupancy calendar.
     */
    public function calendar(Request $request): Response
    {
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        $start = \Carbon\Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        // All rooms with type info
        $rooms = Room::with('roomType')
            ->orderBy('floor')->orderBy('room_number')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'room_number' => $r->room_number,
                'floor' => $r->floor,
                'status' => $r->status,
                'display_status' => $r->display_status,
                'room_type' => $r->roomType?->name,
                'base_price' => (float) $r->roomType?->base_price,
            ]);

        // Bookings that overlap the displayed month
        $bookings = Booking::query()
            ->where('check_in_date', '<=', $end->toDateString())
            ->where('check_out_date', '>', $start->toDateString())
            ->whereNotNull('room_id')
            ->select(['id', 'room_id', 'guest_name', 'guest_email', 'check_in_date', 'check_out_date', 'status', 'booking_source', 'total_amount'])
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'room_id' => $b->room_id,
                'guest_name' => $b->guest_name,
                'guest_email' => $b->guest_email,
                'check_in_date' => $b->check_in_date?->format('Y-m-d'),
                'check_out_date' => $b->check_out_date?->format('Y-m-d'),
                'nights' => (int) $b->check_in_date?->diffInDays($b->check_out_date),
                'status' => $b->status,
                'booking_source' => $b->booking_source,
                'total_amount' => $b->total_amount,
            ]);

        return Inertia::render('calendar/index', [
            'rooms' => $rooms,
            'bookings' => $bookings,
            'year' => $year,
            'month' => $month,
        ]);
    }
}
