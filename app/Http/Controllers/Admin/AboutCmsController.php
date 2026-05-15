<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutCmsController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::where('group', 'about_page')->get()->keyBy('key');

        return Inertia::render('cms/about/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title'        => 'nullable|string',
            'hero_subtitle'     => 'nullable|string',
            'hero_image'        => 'nullable|string',
            'philosophy_para1'  => 'nullable|string',
            'philosophy_para2'  => 'nullable|string',
            // Location section
            'location_title'    => 'nullable|string',
            'location_subtitle' => 'nullable|string',
            'location_image'    => 'nullable|string',
            'location_map_url'  => 'nullable|string',
            'locations'         => 'nullable|array',
            'locations.*.text'  => 'nullable|string',
            'locations.*.dist'  => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : $value,
                    'group' => 'about_page',
                    'type'  => is_array($value) ? 'json' : 'string',
                ]
            );
        }

        return back()->with('success', 'About page updated successfully.');
    }
}
