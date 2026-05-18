<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillaCmsController extends Controller
{
    private function getSettings(string $group): \Illuminate\Support\Collection
    {
        return SiteSetting::where('group', $group)->get()->keyBy('key');
    }

    private function save(array $data, string $prefix, string $group): void
    {
        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $prefix . $key],
                ['value' => $value, 'group' => $group, 'type' => 'string']
            );
        }
    }

    public function bali(): Response
    {
        $raw = $this->getSettings('villa_bali_page');
        // Strip prefix for frontend simplicity
        $settings = $raw->mapWithKeys(fn($v, $k) => [str_replace('vb_', '', $k) => $v]);
        return Inertia::render('cms/villa/bali', ['settings' => $settings]);
    }

    public function updateBali(Request $request)
    {
        $data = $request->validate([
            'hero_title'       => 'nullable|string',
            'hero_subtitle'    => 'nullable|string',
            'hero_image'       => 'nullable|string',
            'hero_label'       => 'nullable|string',
            'section_title'    => 'nullable|string',
            'section_subtitle' => 'nullable|string',
        ]);

        $this->save($data, 'vb_', 'villa_bali_page');
        return back()->with('success', 'Villa Bali page updated successfully.');
    }

    public function lombok(): Response
    {
        $raw = $this->getSettings('villa_lombok_page');
        $settings = $raw->mapWithKeys(fn($v, $k) => [str_replace('vl_', '', $k) => $v]);
        return Inertia::render('cms/villa/lombok', ['settings' => $settings]);
    }

    public function updateLombok(Request $request)
    {
        $data = $request->validate([
            'hero_title'       => 'nullable|string',
            'hero_subtitle'    => 'nullable|string',
            'hero_image'       => 'nullable|string',
            'hero_label'       => 'nullable|string',
            'section_title'    => 'nullable|string',
            'section_subtitle' => 'nullable|string',
        ]);

        $this->save($data, 'vl_', 'villa_lombok_page');
        return back()->with('success', 'Villa Lombok page updated successfully.');
    }
}
