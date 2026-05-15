<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitePage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'content', 'template',
        'meta', 'is_published', 'published_at', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'meta'         => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopePublished($query) { return $query->where('is_published', true); }

    public function getRouteKeyName(): string { return 'slug'; }
}
