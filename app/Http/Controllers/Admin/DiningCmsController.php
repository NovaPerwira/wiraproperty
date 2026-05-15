<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiningCmsController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::where('group', 'dining_page')->get()->keyBy('key');

        return Inertia::render('cms/dining/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title'             => 'nullable|string',
            'hero_subtitle'          => 'nullable|string',
            'hero_image'             => 'nullable|string',
            // Restaurant section
            'restaurant_label'       => 'nullable|string',
            'restaurant_title'       => 'nullable|string',
            'restaurant_description' => 'nullable|string',
            'restaurant_image'       => 'nullable|string',
            'restaurant_cta'         => 'nullable|string',
            // Bar / Lounge section
            'bar_label'              => 'nullable|string',
            'bar_title'              => 'nullable|string',
            'bar_description'        => 'nullable|string',
            'bar_image'              => 'nullable|string',
            'bar_cta'                => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'group' => 'dining_page',
                    'type'  => 'string',
                ]
            );
        }

        return back()->with('success', 'Dining page updated successfully.');
    }
}
