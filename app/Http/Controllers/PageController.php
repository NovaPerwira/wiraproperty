<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\RoomType;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Show the main rooms/stays public page.
     */
    public function stays(): Response
    {
        $settings = SiteSetting::where('group', 'stays_page')->get()->keyBy('key');
        $roomTypes = RoomType::orderBy('base_price')->get();
        return Inertia::render('stays', [
            'roomTypes' => $roomTypes,
            'settings'  => $settings,
        ]);
    }

    /**
     * Show the Experience public page.
     */
    public function experience(): Response
    {
        $settings = SiteSetting::where('group', 'experience_page')->get()->keyBy('key');
        return Inertia::render('experience', ['settings' => $settings]);
    }

    /**
     * Show the Dining public page.
     */
    public function dining(): Response
    {
        $settings = SiteSetting::where('group', 'dining_page')->get()->keyBy('key');
        return Inertia::render('dining', ['settings' => $settings]);
    }

    /**
     * Show the About public page.
     */
    public function about(): Response
    {
        $settings = SiteSetting::where('group', 'about_page')->get()->keyBy('key');
        return Inertia::render('about', ['settings' => $settings]);
    }
}

