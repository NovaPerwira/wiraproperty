<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GallerySectionController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::where('group', 'gallery_section')->get()->keyBy('key');

        $defaultGalleryItems = [
            [
                'id' => 1,
                'title' => 'Earth Sentinels',
                'src' => '/img/villa.png',
                'link' => '#',
                'gridClass' => 'lg:col-span-2 lg:row-span-2',
            ],
            [
                'id' => 2,
                'title' => 'Light Portal',
                'src' => '/img/rumah.png',
                'link' => '#',
                'gridClass' => '',
            ],
            [
                'id' => 3,
                'title' => 'Night Sculpture',
                'src' => '/img/ruko.png',
                'link' => '#',
                'gridClass' => '',
            ],
            [
                'id' => 4,
                'title' => 'The Dome',
                'src' => '/img/tanah.png',
                'link' => '#',
                'gridClass' => '',
            ],
            [
                'id' => 5,
                'title' => 'Bamboo Structure',
                'src' => '/img/villa.png',
                'link' => '#',
                'gridClass' => '',
            ],
        ];

        $galleryItems = isset($settings['items']) ? json_decode($settings['items']->value, true) : $defaultGalleryItems;

        return Inertia::render('cms/gallery-section/index', [
            'galleryItems' => $galleryItems,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'items' => 'required|array|size:5',
            'items.*.id' => 'required',
            'items.*.title' => 'nullable|string|max:255',
            'items.*.src' => 'nullable|string',
            'items.*.link' => 'nullable|string',
            'items.*.gridClass' => 'nullable|string',
            'images.*' => 'nullable|image|max:8192',
        ]);

        $items = $request->input('items');

        // Handle file uploads if any
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                if ($file && $file->isValid() && !empty($file->getRealPath())) {
                    $path = $file->store('gallery-section', 'public');
                    if ($path) {
                        $items[$index]['src'] = Storage::url($path);
                    }
                }
            }
        }

        SiteSetting::updateOrCreate(
            ['key' => 'items'],
            [
                'value' => json_encode($items),
                'group' => 'gallery_section',
                'type' => 'json',
            ]
        );

        return back()->with('success', 'Gallery Section updated successfully.');
    }
}
