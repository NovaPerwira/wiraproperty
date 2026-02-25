<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'id_number',
        'nationality',
        'date_of_birth',
        'preferences',
        'notes',
        'is_blacklisted',
        'blacklist_reason',
        'total_bookings',
        'total_spend',
    ];

    protected function casts(): array
    {
        return [
            'preferences' => 'array',
            'date_of_birth' => 'date',
            'is_blacklisted' => 'boolean',
            'total_spend' => 'decimal:2',
            'total_bookings' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // ─── Query Scopes ─────────────────────────────────────────────────────────

    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', '%' . $term . '%')
                ->orWhere('email', 'like', '%' . $term . '%')
                ->orWhere('phone', 'like', '%' . $term . '%')
                ->orWhere('id_number', 'like', '%' . $term . '%');
        });
    }

    public function scopeBlacklisted(Builder $query): Builder
    {
        return $query->where('is_blacklisted', true);
    }

    public function scopeNotBlacklisted(Builder $query): Builder
    {
        return $query->where('is_blacklisted', false);
    }

    // ─── Counters (called from Booking observer) ──────────────────────────────

    /**
     * Recalculate counters from actual bookings data.
     * Called when a booking reaches checked_out or is a new confirmed booking.
     */
    public function recalculateCounters(): void
    {
        $result = $this->bookings()
            ->whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
            ->selectRaw('COUNT(*) as cnt, COALESCE(SUM(total_amount), 0) as spend')
            ->first();

        $this->updateQuietly([
            'total_bookings' => $result->cnt ?? 0,
            'total_spend' => $result->spend ?? 0,
        ]);
    }
}
