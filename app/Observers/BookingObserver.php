<?php

namespace App\Observers;

use App\Models\Booking;
use App\Models\HousekeepingTask;

class BookingObserver
{
    /**
     * When a booking transitions to checked_out:
     * 1. Auto-create a cleaning task for the room.
     * 2. Recalculate the linked guest's counters.
     */
    public function updated(Booking $booking): void
    {
        $original = $booking->getOriginal('status');
        $current = $booking->status;

        if ($original !== $current && $current === 'checked_out') {
            // ① Create cleaning task for the room
            if ($booking->room_id) {
                // Avoid duplicate tasks for same room on same day
                $alreadyExists = HousekeepingTask::where('room_id', $booking->room_id)
                    ->where('task_type', 'cleaning')
                    ->whereDate('scheduled_for', now()->toDateString())
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->exists();

                if (!$alreadyExists) {
                    HousekeepingTask::create([
                        'room_id' => $booking->room_id,
                        'booking_id' => $booking->id,
                        'task_type' => 'cleaning',
                        'status' => 'pending',
                        'priority' => 'normal',
                        'scheduled_for' => now()->toDateString(),
                        'notes' => "Post-checkout cleaning for booking #{$booking->id} ({$booking->guest_name})",
                    ]);
                }
            }

            // ② Refresh guest counters
            if ($booking->guest_id && $booking->guest) {
                $booking->guest->recalculateCounters();
            }
        }

        // Also update counters when booking is confirmed (new revenue)
        if ($original !== $current && in_array($current, ['confirmed', 'cancelled'])) {
            if ($booking->guest_id && $booking->guest) {
                $booking->guest->recalculateCounters();
            }
        }
    }
}
