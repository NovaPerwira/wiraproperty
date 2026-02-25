<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HousekeepingTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'assigned_to',
        'booking_id',
        'task_type',
        'status',
        'priority',
        'notes',
        'scheduled_for',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_for' => 'date',
            'completed_at' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    // ─── Query Scopes ─────────────────────────────────────────────────────────

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('scheduled_for', $date);
    }

    public function scopeUrgent(Builder $query): Builder
    {
        return $query->where('priority', 'urgent');
    }

    // ─── Computed ─────────────────────────────────────────────────────────────

    /**
     * Map status → Tailwind-compatible badge color keyword.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'amber',
            'in_progress' => 'blue',
            'done' => 'green',
            'skipped' => 'slate',
            default => 'slate',
        };
    }
}
