<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TanahCmsController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::where('group', 'tanah_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('tanah_', '', $s->key) => $s]);
        return Inertia::render('cms/tanah/index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title'       => 'nullable|string',
            'hero_subtitle'    => 'nullable|string',
            'hero_image'       => 'nullable|string',
            'hero_label'       => 'nullable|string',
            'section_title'    => 'nullable|string',
            'section_subtitle' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => 'tanah_' . $key],
                ['value' => $value, 'group' => 'tanah_page', 'type' => 'string']
            );
        }

        return back()->with('success', 'Tanah page updated successfully.');
    }
}
