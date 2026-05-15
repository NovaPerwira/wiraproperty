<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvailabilityBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id', 'start_date', 'end_date', 'reason', 'type', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date'   => 'date',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function scopeActive($query)
    {
        return $query->where('end_date', '>=', now()->toDateString());
    }
}
