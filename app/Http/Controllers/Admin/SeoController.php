<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/seo/index', [
            'seoPages'     => SeoSetting::all()->keyBy('page_key'),
            'siteSettings' => SiteSetting::all()->groupBy('group'),
            'pageKeys'     => ['home', 'stays', 'gallery', 'about', 'contact', 'experience', 'dining'],
        ]);
    }

    public function updateSeo(Request $request, string $pageKey)
    {
        $data = $request->validate([
            'title'          => 'nullable|string|max:70',
            'description'    => 'nullable|string|max:160',
            'keywords'       => 'nullable|string|max:500',
            'og_title'       => 'nullable|string|max:95',
            'og_description' => 'nullable|string|max:200',
            'og_image'       => 'nullable|url|max:500',
            'canonical_url'  => 'nullable|url|max:500',
            'robots'         => 'nullable|string|max:100',
        ]);

        SeoSetting::updateOrCreate(
            ['page_key' => $pageKey],
            $data
        );

        return back()->with('success', "SEO for '{$pageKey}' saved.");
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'settings'         => 'required|array',
            'settings.*.key'   => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $s) {
            SiteSetting::set($s['key'], $s['value'] ?? '');
        }

        return back()->with('success', 'Settings saved.');
    }
}
