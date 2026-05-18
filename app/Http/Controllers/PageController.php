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

    /**
     * Show the Villa Bali public page.
     */
    public function villaBali(): Response
    {
        $settings = SiteSetting::where('group', 'villa_bali_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('vb_', '', $s->key) => $s]);
        $properties = \App\Models\Property::where('category', 'villa')
            ->where('region', 'bali')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('villa/bali', ['settings' => $settings, 'properties' => $properties]);
    }

    /**
     * Show the Villa Lombok public page.
     */
    public function villaLombok(): Response
    {
        $settings = SiteSetting::where('group', 'villa_lombok_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('vl_', '', $s->key) => $s]);
        $properties = \App\Models\Property::where('category', 'villa')
            ->where('region', 'lombok')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('villa/lombok', ['settings' => $settings, 'properties' => $properties]);
    }

    /**
     * Show the Property Rumah public page.
     */
    public function propertyRumah(): Response
    {
        $settings = SiteSetting::where('group', 'property_rumah_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('pr_', '', $s->key) => $s]);
        $properties = \App\Models\Property::where('category', 'general')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        return Inertia::render('property/rumah', ['settings' => $settings, 'properties' => $properties]);
    }

    /**
     * Show the Property Ruko public page.
     */
    public function propertyRuko(): Response
    {
        $settings = SiteSetting::where('group', 'property_ruko_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('pru_', '', $s->key) => $s]);
        $properties = \App\Models\Property::where('category', 'general')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        return Inertia::render('property/ruko', ['settings' => $settings, 'properties' => $properties]);
    }

    /**
     * Show the Property Villa public page.
     */
    public function propertyVilla(): Response
    {
        $settings = SiteSetting::where('group', 'property_villa_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('pv_', '', $s->key) => $s]);
        $properties = \App\Models\Property::where('category', 'villa')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        return Inertia::render('property/villa', ['settings' => $settings, 'properties' => $properties]);
    }

    /**
     * Show the Tanah public page.
     */
    public function tanah(): Response
    {
        $settings = SiteSetting::where('group', 'tanah_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('tanah_', '', $s->key) => $s]);
        $properties = \App\Models\Property::where('category', 'tanah')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        return Inertia::render('tanah', ['settings' => $settings, 'properties' => $properties]);
    }
}

