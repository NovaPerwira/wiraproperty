<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_type_id',
        'room_number',
        'floor',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'floor' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function housekeepingTasks(): HasMany
    {
        return $this->hasMany(HousekeepingTask::class);
    }

    // ─── Dynamic Availability Scopes ─────────────────────────────────────────

    /**
     * Rooms that are NOT physically under maintenance.
     */
    public function scopeNotMaintenance(Builder $query): Builder
    {
        return $query->where('status', 'available');
    }

    /**
     * Rooms that have NO active booking overlapping [checkIn, checkOut).
     *
     * Overlap condition (inclusive check-in, exclusive check-out):
     *   existing.check_in_date  < requested.check_out_date
     *   existing.check_out_date > requested.check_in_date
     *
     * Excludes cancelled/checked_out bookings from the overlap check.
     */
    public function scopeAvailableBetween(Builder $query, string $checkIn, string $checkOut): Builder
    {
        return $query->whereDoesntHave('bookings', function (Builder $q) use ($checkIn, $checkOut) {
            $q->whereNotIn('status', ['cancelled', 'checked_out'])
                ->where('check_in_date', '<', $checkOut)
                ->where('check_out_date', '>', $checkIn);
        });
    }

    /**
     * Combined: physically available AND not booked in range.
     */
    public function scopeAvailableFor(Builder $query, string $checkIn, string $checkOut): Builder
    {
        return $query->notMaintenance()->availableBetween($checkIn, $checkOut);
    }

    /**
     * Check if this specific room is available for the given date range.
     */
    public function isAvailableFor(string $checkIn, string $checkOut, ?int $excludeBookingId = null): bool
    {
        if ($this->status === 'maintenance') {
            return false;
        }

        return !$this->bookings()
            ->whereNotIn('status', ['cancelled', 'checked_out'])
            ->where('check_in_date', '<', $checkOut)
            ->where('check_out_date', '>', $checkIn)
            ->when($excludeBookingId, fn($q) => $q->where('id', '!=', $excludeBookingId))
            ->exists();
    }

    /**
     * Computed physical status + booking status for display.
     * Returns: 'maintenance' | 'occupied' | 'available'
     */
    public function getDisplayStatusAttribute(): string
    {
        if ($this->status === 'maintenance') {
            return 'maintenance';
        }

        $today = now()->toDateString();
        $hasActiveBooking = $this->bookings()
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where('check_in_date', '<=', $today)
            ->where('check_out_date', '>', $today)
            ->exists();

        return $hasActiveBooking ? 'occupied' : 'available';
    }
}
