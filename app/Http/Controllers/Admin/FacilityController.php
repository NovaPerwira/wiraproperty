<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/facilities/index', [
            'facilities' => Facility::ordered()->get(),
            'categories' => ['general', 'room', 'pool', 'dining', 'wellness', 'entertainment', 'outdoor'],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'icon'        => 'nullable|string|max:10',
            'description' => 'nullable|string|max:500',
            'category'    => 'nullable|string',
            'is_active'   => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        Facility::create($data);
        return back()->with('success', 'Facility added.');
    }

    public function update(Request $request, Facility $facility)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'icon'        => 'nullable|string|max:10',
            'description' => 'nullable|string|max:500',
            'category'    => 'nullable|string',
            'is_active'   => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        $facility->update($data);
        return back()->with('success', 'Facility updated.');
    }

    public function destroy(Facility $facility)
    {
        $facility->delete();
        return back()->with('success', 'Facility deleted.');
    }
}
