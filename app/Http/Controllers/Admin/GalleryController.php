<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $images = GalleryImage::with('room')
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->ordered()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('cms/gallery/index', [
            'images' => $images,
            'rooms' => Room::select('id', 'room_number')->orderBy('room_number')->get(),
            'filters' => $request->only('category'),
            'categories' => ['general', 'room', 'pool', 'dining', 'exterior', 'amenities'],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:8192',
            'category' => 'nullable|string',
            'room_id' => 'nullable|exists:rooms,id',
        ]);

        $category = $request->category ?? 'general';
        $created = [];

        foreach ($request->file('images') as $file) {
            if (empty($file->getRealPath())) {
                continue;
            }

            $path = $file->store('gallery', 'public');
            
            if ($path) {
                $created[] = GalleryImage::create([
                    'path' => $path,
                    'url' => Storage::url($path),
                    'category' => $category,
                    'room_id' => $request->room_id,
                    'sort_order' => ((int) GalleryImage::max('sort_order')) + 1,
                    'is_active' => true,
                    'is_featured' => false,
                ]);
            }
        }

        return back()->with('success', count($created) . ' image(s) uploaded.');
    }

    public function update(Request $request, GalleryImage $galleryImage)
    {
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
            'category' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'room_id' => 'nullable|exists:rooms,id',
        ]);

        $galleryImage->update($data);

        return back()->with('success', 'Image updated.');
    }

    public function destroy(GalleryImage $galleryImage)
    {
        Storage::disk('public')->delete($galleryImage->path);
        $galleryImage->delete();

        return back()->with('success', 'Image deleted.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:gallery_images,id',
        ]);

        foreach ($request->order as $position => $id) {
            GalleryImage::where('id', $id)->update(['sort_order' => $position]);
        }

        return response()->json(['ok' => true]);
    }
}
