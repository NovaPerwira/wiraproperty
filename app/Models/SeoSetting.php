<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_key', 'title', 'description', 'keywords',
        'og_title', 'og_description', 'og_image',
        'canonical_url', 'schema_markup', 'robots',
    ];

    protected function casts(): array
    {
        return [
            'schema_markup' => 'array',
        ];
    }

    public static function forPage(string $key): ?static
    {
        return static::where('page_key', $key)->first();
    }
}
