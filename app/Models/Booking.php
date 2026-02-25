<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'created_by',
        'guest_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'guest_address',
        'check_in_date',
        'check_out_date',
        'status',
        'booking_source',
        'total_amount',
        'special_requests',
    ];

    protected function casts(): array
    {
        return [
            'check_in_date' => 'date',
            'check_out_date' => 'date',
            'total_amount' => 'decimal:2',
        ];
    }

    // ─── Computed Attributes ──────────────────────────────────────────────────

    /**
     * Number of nights = check_out - check_in (in days).
     */
    public function getNightsAttribute(): int
    {
        if (!$this->check_in_date || !$this->check_out_date) {
            return 0;
        }
        return (int) $this->check_in_date->diffInDays($this->check_out_date);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function housekeepingTasks(): HasMany
    {
        return $this->hasMany(HousekeepingTask::class);
    }

    // ─── Computed Financials ──────────────────────────────────────────────────

    /**
     * Amount still owed = total_amount - sum of 'paid' payments.
     */
    public function getOutstandingAttribute(): float
    {
        $paid = $this->payments()
            ->where('payment_status', 'paid')
            ->sum('amount');
        return max(0, (float) $this->total_amount - (float) $paid);
    }

    // ─── Query Scopes ─────────────────────────────────────────────────────────

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeBySource(Builder $query, string $source): Builder
    {
        return $query->where('booking_source', $source);
    }

    /**
     * Filter bookings whose check_in_date falls within the given range.
     */
    public function scopeByDateRange(Builder $query, ?string $from, ?string $to): Builder
    {
        if ($from) {
            $query->where('check_in_date', '>=', $from);
        }
        if ($to) {
            $query->where('check_in_date', '<=', $to);
        }
        return $query;
    }

    /**
     * Search by guest name, email, or phone (parameterised LIKE).
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function (Builder $q) use ($term) {
            $q->where('guest_name', 'like', '%' . $term . '%')
                ->orWhere('guest_email', 'like', '%' . $term . '%')
                ->orWhere('guest_phone', 'like', '%' . $term . '%');
        });
    }

    /**
     * Bookings that overlap a date range (used by Room::scopeAvailableBetween).
     * Active statuses only (excludes cancelled/checked_out).
     */
    public function scopeActiveOverlapping(Builder $query, string $checkIn, string $checkOut): Builder
    {
        return $query->whereNotIn('status', ['cancelled', 'checked_out'])
            ->where('check_in_date', '<', $checkOut)
            ->where('check_out_date', '>', $checkIn);
    }
}
