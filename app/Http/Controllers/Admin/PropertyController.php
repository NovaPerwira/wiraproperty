<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function villa()
    {
        // Villa shows ALL regions — admin can see/filter all villa listings here
        $properties = Property::where('category', 'villa')
            ->orderBy('region')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/properties/index', [
            'category'   => 'villa',
            'title'      => 'Villa',
            'properties' => $properties,
            'regions'    => [
                ['value' => 'bali',   'label' => 'Bali'],
                ['value' => 'lombok', 'label' => 'Lombok / Luar Bali'],
            ],
        ]);
    }

    public function general()
    {
        $properties = Property::where('category', 'general')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/properties/index', [
            'category'   => 'general',
            'title'      => 'Property (Rumah/Ruko)',
            'properties' => $properties,
            'regions'    => [],
        ]);
    }

    public function tanah()
    {
        $properties = Property::where('category', 'tanah')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/properties/index', [
            'category'   => 'tanah',
            'title'      => 'Tanah',
            'properties' => $properties,
            'regions'    => [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'category'        => 'required|string',
            'region'          => 'nullable|string|max:100',
            'location'        => 'nullable|string|max:255',
            'price_formatted' => 'nullable|string|max:255',
            'size'            => 'nullable|string|max:255',
            'beds'            => 'nullable|integer',
            'baths'           => 'nullable|integer',
            'zoning'          => 'nullable|string|max:255',
            'rating'          => 'nullable|numeric|min:0|max:5',
            'tag'             => 'nullable|string|max:255',
            'main_image'      => 'nullable|string',
            'is_active'       => 'boolean',
        ]);

        Property::create($validated);

        return back()->with('success', 'Property added successfully.');
    }

    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'category'        => 'required|string',
            'region'          => 'nullable|string|max:100',
            'location'        => 'nullable|string|max:255',
            'price_formatted' => 'nullable|string|max:255',
            'size'            => 'nullable|string|max:255',
            'beds'            => 'nullable|integer',
            'baths'           => 'nullable|integer',
            'zoning'          => 'nullable|string|max:255',
            'rating'          => 'nullable|numeric|min:0|max:5',
            'tag'             => 'nullable|string|max:255',
            'main_image'      => 'nullable|string',
            'is_active'       => 'boolean',
        ]);

        $property->update($validated);

        return back()->with('success', 'Property updated successfully.');
    }

    public function destroy(Property $property)
    {
        $property->delete();
        return back()->with('success', 'Property deleted.');
    }
}
