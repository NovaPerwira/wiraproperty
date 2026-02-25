<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::query()
            ->with('booking:id,guest_name,guest_email,room_id,total_amount', 'recordedBy:id,name')
            ->latest('paid_at');

        if ($status = $request->string('status')->trim()->value()) {
            $query->byStatus($status);
        }
        if ($method = $request->string('method')->trim()->value()) {
            $query->byMethod($method);
        }
        if ($from = $request->string('date_from')->trim()->value()) {
            $query->whereDate('paid_at', '>=', $from);
        }
        if ($to = $request->string('date_to')->trim()->value()) {
            $query->whereDate('paid_at', '<=', $to);
        }

        $payments = $query->paginate(20)->withQueryString()
            ->through(fn($p) => [
                'id' => $p->id,
                'booking_id' => $p->booking_id,
                'guest_name' => $p->booking?->guest_name,
                'guest_email' => $p->booking?->guest_email,
                'booking_total' => (float) $p->booking?->total_amount,
                'amount' => (float) $p->amount,
                'payment_method' => $p->payment_method,
                'payment_status' => $p->payment_status,
                'paid_at' => $p->paid_at?->format('Y-m-d H:i'),
                'reference_number' => $p->reference_number,
                'notes' => $p->notes,
                'recorded_by' => $p->recordedBy?->name,
            ]);

        // KPI summary
        $todayRevenue = Payment::paid()
            ->whereDate('paid_at', now()->toDateString())
            ->sum('amount');

        $totalOutstanding = Booking::whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->get()
            ->sum(fn($b) => $b->outstanding);

        $paidCount = Payment::paid()->count();

        // Daily revenue for last 30 days (for mini chart)
        $dailyRevenue = Payment::paid()
            ->selectRaw("DATE(paid_at) as date, SUM(amount) as total")
            ->where('paid_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'total' => (float) $r->total]);

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['status', 'method', 'date_from', 'date_to']),
            'todayRevenue' => (float) $todayRevenue,
            'totalOutstanding' => (float) $totalOutstanding,
            'paidCount' => $paidCount,
            'dailyRevenue' => $dailyRevenue,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,transfer,credit_card,debit_card,ota',
            'payment_status' => 'required|in:pending,paid,partial,refunded',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $data['recorded_by'] = auth()->id();
        if ($data['payment_status'] === 'paid') {
            $data['paid_at'] = now();
        }

        Payment::create($data);

        return back()->with('success', 'Pembayaran dicatat.');
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $data = $request->validate([
            'payment_status' => 'required|in:pending,paid,partial,refunded',
            'amount' => 'sometimes|numeric|min:1',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        if ($data['payment_status'] === 'paid' && !$payment->paid_at) {
            $data['paid_at'] = now();
        }

        $payment->update($data);

        return back()->with('success', 'Pembayaran diperbarui.');
    }
}
