<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaysCmsController extends Controller
{
    public function index(): Response
    {
        $settings  = SiteSetting::where('group', 'stays_page')->get()->keyBy('key');
        $roomTypes = RoomType::orderBy('base_price')->get();

        return Inertia::render('cms/stays/index', [
            'settings'  => $settings,
            'roomTypes' => $roomTypes,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title'             => 'nullable|string',
            'hero_subtitle'          => 'nullable|string',
            'hero_image'             => 'nullable|string',
            'hero_label'             => 'nullable|string',
            'rooms_section_title'    => 'nullable|string',
            'rooms_section_subtitle' => 'nullable|string',
            'room_cta_label'         => 'nullable|string',
            'room_per_night'         => 'nullable|string',
            'label_popular'          => 'nullable|string',
            'label_cancel'           => 'nullable|string',
            'label_guests'           => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'group' => 'stays_page',
                    'type'  => 'string',
                ]
            );
        }

        return back()->with('success', 'Stays page content updated successfully.');
    }
}
