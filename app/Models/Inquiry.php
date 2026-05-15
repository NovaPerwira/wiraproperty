<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'subject', 'message',
        'status', 'source', 'room_id',
        'check_in', 'check_out', 'guests',
        'admin_notes', 'replied_at',
    ];

    protected function casts(): array
    {
        return [
            'check_in'   => 'date',
            'check_out'  => 'date',
            'replied_at' => 'datetime',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeNew($query)      { return $query->where('status', 'new'); }
    public function scopeUnreplied($query){ return $query->whereNull('replied_at'); }
}
