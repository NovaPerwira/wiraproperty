<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'homepage')->get()->keyBy('key');

        return Inertia::render('cms/homepage/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'about_title' => 'nullable|string',
            'about_subtitle' => 'nullable|string',
            'about_image' => 'nullable|string',
            'location_title' => 'nullable|string',
            'location_subtitle' => 'nullable|string',
            'location_image' => 'nullable|string',
            'locations' => 'nullable|array',
            'stats' => 'nullable|array',
            'featured_stays' => 'nullable|array',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : $value,
                    'group' => 'homepage',
                    'type' => is_array($value) ? 'json' : 'string',
                ]
            );
        }

        return back()->with('success', 'Homepage content updated successfully.');
    }
}
