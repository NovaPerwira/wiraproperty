<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceCmsController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::where('group', 'experience_page')->get()->keyBy('key');

        return Inertia::render('cms/experience/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title'        => 'nullable|string',
            'hero_subtitle'     => 'nullable|string',
            'hero_image'        => 'nullable|string',
            // Highlight 1 — Infinity Pool
            'pool_title'        => 'nullable|string',
            'pool_description'  => 'nullable|string',
            'pool_image'        => 'nullable|string',
            'pool_cta'          => 'nullable|string',
            // Highlight 2 — Wellness / Spa
            'spa_title'         => 'nullable|string',
            'spa_description'   => 'nullable|string',
            'spa_image'         => 'nullable|string',
            'spa_cta'           => 'nullable|string',
            // Icon facilities (JSON array)
            'facilities'        => 'nullable|array',
            'facilities.*.title'=> 'nullable|string',
            'facilities.*.desc' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : $value,
                    'group' => 'experience_page',
                    'type'  => is_array($value) ? 'json' : 'string',
                ]
            );
        }

        return back()->with('success', 'Experience page updated successfully.');
    }
}
