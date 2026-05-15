<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $testimonials = Testimonial::with('room')
            ->when($request->platform, fn($q) => $q->where('platform', $request->platform))
            ->ordered()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('cms/testimonials/index', [
            'testimonials' => $testimonials,
            'rooms'        => Room::select('id', 'room_number')->orderBy('room_number')->get(),
            'filters'      => $request->only('platform'),
            'platforms'    => ['direct', 'google', 'tripadvisor', 'booking', 'airbnb'],
            'stats'        => [
                'total'    => Testimonial::count(),
                'featured' => Testimonial::where('is_featured', true)->count(),
                'avg'      => round(Testimonial::avg('rating'), 1),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name'     => 'required|string|max:255',
            'guest_location' => 'nullable|string|max:255',
            'content'        => 'required|string|max:2000',
            'rating'         => 'required|integer|min:1|max:5',
            'platform'       => 'nullable|string',
            'platform_url'   => 'nullable|url|max:500',
            'stay_date'      => 'nullable|date',
            'room_id'        => 'nullable|exists:rooms,id',
            'is_featured'    => 'boolean',
            'is_active'      => 'boolean',
        ]);

        Testimonial::create($data);
        return back()->with('success', 'Testimonial created.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $data = $request->validate([
            'guest_name'     => 'sometimes|string|max:255',
            'guest_location' => 'nullable|string|max:255',
            'content'        => 'sometimes|string|max:2000',
            'rating'         => 'sometimes|integer|min:1|max:5',
            'platform'       => 'nullable|string',
            'platform_url'   => 'nullable|url|max:500',
            'stay_date'      => 'nullable|date',
            'room_id'        => 'nullable|exists:rooms,id',
            'is_featured'    => 'boolean',
            'is_active'      => 'boolean',
            'sort_order'     => 'nullable|integer',
        ]);

        $testimonial->update($data);
        return back()->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return back()->with('success', 'Testimonial deleted.');
    }
}
