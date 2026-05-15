<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'caption', 'path', 'url',
        'category', 'sort_order', 'is_featured', 'is_active', 'room_id',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_active'   => 'boolean',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function scopeActive($query)    { return $query->where('is_active', true); }
    public function scopeFeatured($query)  { return $query->where('is_featured', true); }
    public function scopeOrdered($query)   { return $query->orderBy('sort_order')->orderBy('id'); }
}
