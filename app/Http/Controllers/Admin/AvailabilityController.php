<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityBlock;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvailabilityController extends Controller
{
    public function index(Request $request): Response
    {
        $month   = $request->integer('month', now()->month);
        $year    = $request->integer('year', now()->year);
        $roomId  = $request->integer('room_id');

        $rooms = Room::with('roomType')
            ->when($roomId, fn($q) => $q->where('id', $roomId))
            ->orderBy('room_number')
            ->get();

        $start = now()->setYear($year)->setMonth($month)->startOfMonth()->toDateString();
        $end   = now()->setYear($year)->setMonth($month)->endOfMonth()->toDateString();

        $bookings = Booking::with(['room', 'guest'])
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('check_in_date', [$start, $end])
                  ->orWhereBetween('check_out_date', [$start, $end])
                  ->orWhere(fn($q) => $q->where('check_in_date', '<', $start)->where('check_out_date', '>', $end));
            })
            ->whereNotIn('status', ['cancelled'])
            ->when($roomId, fn($q) => $q->where('room_id', $roomId))
            ->get();

        $blocks = AvailabilityBlock::active()
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('start_date', [$start, $end])
                  ->orWhereBetween('end_date', [$start, $end]);
            })
            ->when($roomId, fn($q) => $q->where('room_id', $roomId))
            ->with('room')
            ->get();

        return Inertia::render('cms/availability/index', [
            'rooms'    => $rooms,
            'bookings' => $bookings,
            'blocks'   => $blocks,
            'month'    => $month,
            'year'     => $year,
            'roomId'   => $roomId ?: null,
        ]);
    }

    public function storeBlock(Request $request)
    {
        $data = $request->validate([
            'room_id'    => 'nullable|exists:rooms,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after:start_date',
            'reason'     => 'nullable|string|max:255',
            'type'       => 'nullable|in:block,maintenance',
            'notes'      => 'nullable|string|max:1000',
        ]);

        AvailabilityBlock::create($data);
        return back()->with('success', 'Availability block created.');
    }

    public function destroyBlock(AvailabilityBlock $block)
    {
        $block->delete();
        return back()->with('success', 'Block removed.');
    }
}
