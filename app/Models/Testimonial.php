<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_name', 'guest_location', 'guest_avatar',
        'content', 'rating', 'platform', 'platform_url',
        'stay_date', 'room_id', 'is_featured', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'stay_date'   => 'date',
            'is_featured' => 'boolean',
            'is_active'   => 'boolean',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function scopeActive($query)   { return $query->where('is_active', true); }
    public function scopeFeatured($query) { return $query->where('is_featured', true); }
    public function scopeOrdered($query)  { return $query->orderBy('sort_order')->orderByDesc('stay_date'); }
}
