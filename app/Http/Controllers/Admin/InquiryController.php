<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Inquiry::with('room')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('subject', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('cms/inquiries/index', [
            'inquiries' => $query,
            'filters'   => $request->only('status', 'search'),
            'stats'     => [
                'total'    => Inquiry::count(),
                'new'      => Inquiry::where('status', 'new')->count(),
                'replied'  => Inquiry::where('status', 'replied')->count(),
                'archived' => Inquiry::where('status', 'archived')->count(),
            ],
        ]);
    }

    public function update(Request $request, Inquiry $inquiry)
    {
        $data = $request->validate([
            'status'      => 'sometimes|in:new,read,replied,archived',
            'admin_notes' => 'sometimes|nullable|string|max:2000',
        ]);

        if (isset($data['status']) && $data['status'] === 'replied') {
            $data['replied_at'] = now();
        }

        $inquiry->update($data);

        return back()->with('success', 'Inquiry updated.');
    }

    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();
        return back()->with('success', 'Inquiry deleted.');
    }

    // Public form submission
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|max:255',
            'phone'     => 'nullable|string|max:50',
            'subject'   => 'nullable|string|max:255',
            'message'   => 'required|string|max:3000',
            'room_id'   => 'nullable|exists:rooms,id',
            'check_in'  => 'nullable|date|after_or_equal:today',
            'check_out' => 'nullable|date|after:check_in',
            'guests'    => 'nullable|integer|min:1|max:20',
        ]);

        Inquiry::create($data + ['status' => 'new', 'source' => 'website']);

        return back()->with('success', 'Your inquiry has been sent! We will reply within 24 hours.');
    }
}
