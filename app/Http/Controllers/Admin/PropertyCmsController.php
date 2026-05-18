<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyCmsController extends Controller
{
    private function save(array $data, string $prefix, string $group): void
    {
        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $prefix . $key],
                ['value' => $value, 'group' => $group, 'type' => 'string']
            );
        }
    }

    private function getSettings(string $group, string $prefix): \Illuminate\Support\Collection
    {
        return SiteSetting::where('group', $group)->get()
            ->mapWithKeys(fn($v, $k) => [str_replace($prefix, '', $v->key) => $v])
            ->keyBy(fn($v) => str_replace($prefix, '', $v->key));
    }

    public function rumah(): Response
    {
        $settings = SiteSetting::where('group', 'property_rumah_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('pr_', '', $s->key) => $s]);
        return Inertia::render('cms/property/rumah', ['settings' => $settings]);
    }

    public function updateRumah(Request $request)
    {
        $data = $request->validate([
            'hero_title'       => 'nullable|string',
            'hero_subtitle'    => 'nullable|string',
            'hero_image'       => 'nullable|string',
            'hero_label'       => 'nullable|string',
            'section_title'    => 'nullable|string',
            'section_subtitle' => 'nullable|string',
        ]);
        $this->save($data, 'pr_', 'property_rumah_page');
        return back()->with('success', 'Property Rumah page updated successfully.');
    }

    public function ruko(): Response
    {
        $settings = SiteSetting::where('group', 'property_ruko_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('pru_', '', $s->key) => $s]);
        return Inertia::render('cms/property/ruko', ['settings' => $settings]);
    }

    public function updateRuko(Request $request)
    {
        $data = $request->validate([
            'hero_title'       => 'nullable|string',
            'hero_subtitle'    => 'nullable|string',
            'hero_image'       => 'nullable|string',
            'hero_label'       => 'nullable|string',
            'section_title'    => 'nullable|string',
            'section_subtitle' => 'nullable|string',
        ]);
        $this->save($data, 'pru_', 'property_ruko_page');
        return back()->with('success', 'Property Ruko page updated successfully.');
    }

    public function villa(): Response
    {
        $settings = SiteSetting::where('group', 'property_villa_page')->get()
            ->mapWithKeys(fn($s) => [str_replace('pv_', '', $s->key) => $s]);
        return Inertia::render('cms/property/villa', ['settings' => $settings]);
    }

    public function updateVilla(Request $request)
    {
        $data = $request->validate([
            'hero_title'       => 'nullable|string',
            'hero_subtitle'    => 'nullable|string',
            'hero_image'       => 'nullable|string',
            'hero_label'       => 'nullable|string',
            'section_title'    => 'nullable|string',
            'section_subtitle' => 'nullable|string',
        ]);
        $this->save($data, 'pv_', 'property_villa_page');
        return back()->with('success', 'Property Villa page updated successfully.');
    }
}
