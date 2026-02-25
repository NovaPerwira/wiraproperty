<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\HousekeepingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// ── Dashboard ─────────────────────────────────────────────────────────────────
Route::get('dashboard', function () {
    $today = now()->toDateString();
    $monthStart = now()->startOfMonth()->toDateString();
    $monthEnd = now()->endOfMonth()->toDateString();
    $periodMonths = (int) request()->input('period', 6);              // 3 / 6 / 12
    $periodStart = now()->subMonths($periodMonths - 1)->startOfMonth();

    // ── Room inventory ───────────────────────────────────────────────────────
    $totalRooms = Room::count();
    $maintenance = Room::where('status', 'maintenance')->count();
    $sellableRooms = max(1, $totalRooms - $maintenance);

    // Occupied today (confirmed + checked-in overlapping today)
    $occupiedToday = Booking::whereIn('status', ['confirmed', 'checked_in'])
        ->where('check_in_date', '<=', $today)
        ->where('check_out_date', '>', $today)
        ->whereNotNull('room_id')
        ->distinct('room_id')
        ->count('room_id');

    // ── Business Performance KPIs ────────────────────────────────────────────
    // Occupancy Rate = occupied / sellable rooms * 100
    $occupancyRate = round($occupiedToday / $sellableRooms * 100, 1);

    // Monthly Revenue (paid/confirmed/checked-in bookings with check-in this month)
    $monthlyRevenue = Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
        ->whereBetween('check_in_date', [$monthStart, $monthEnd])
        ->sum('total_amount');

    // ARR – Average Room Rate (revenue per sold room this month)
    $soldRoomsThisMonth = Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
        ->whereBetween('check_in_date', [$monthStart, $monthEnd])
        ->count();

    $arr = $soldRoomsThisMonth > 0 ? round($monthlyRevenue / $soldRoomsThisMonth) : 0;

    // RevPAR = Monthly Revenue / (sellable rooms × days in month)
    $daysInMonth = (int) now()->daysInMonth;
    $revpar = round($monthlyRevenue / ($sellableRooms * $daysInMonth));

    // ── Operational Snapshot ─────────────────────────────────────────────────
    $pendingBookings = Booking::where('status', 'pending')->count();
    $availableRooms = max(0, $sellableRooms - $occupiedToday);

    // ── Trendline: Revenue + Occupancy per month ─────────────────────────────
    // Revenue per month
    $revenueTrend = Booking::selectRaw("
            DATE_FORMAT(check_in_date,'%b %Y') as month,
            YEAR(check_in_date)  as year,
            MONTH(check_in_date) as month_num,
            COALESCE(SUM(total_amount),0) as revenue
        ")
        ->whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
        ->where('check_in_date', '>=', $periodStart)
        ->groupByRaw('year, month_num, month')
        ->orderByRaw('year, month_num')
        ->get();

    // Occupancy % per month — occupied-room-nights / (sellable × days_in_month)
    $occupancyTrend = Booking::selectRaw("
            DATE_FORMAT(check_in_date,'%b %Y') as month,
            YEAR(check_in_date)  as year,
            MONTH(check_in_date) as month_num,
            COUNT(*) as booked,
            SUM(DATEDIFF(LEAST(check_out_date, LAST_DAY(check_in_date) + INTERVAL 1 DAY), GREATEST(check_in_date, DATE_FORMAT(check_in_date,'%%Y-%%m-01')))) as room_nights
        ")
        ->whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
        ->where('check_in_date', '>=', $periodStart)
        ->groupByRaw('year, month_num, month')
        ->orderByRaw('year, month_num')
        ->get();

    // Map occupancy trend to %
    $trendMap = [];
    foreach ($revenueTrend as $r) {
        $key = $r->year . '-' . $r->month_num;
        $trendMap[$key] = ['month' => $r->month, 'revenue' => (float) $r->revenue, 'occupancy' => 0];
    }
    foreach ($occupancyTrend as $o) {
        $key = $o->year . '-' . $o->month_num;
        $daysInM = cal_days_in_month(CAL_GREGORIAN, $o->month_num, $o->year);
        $occ = round((float) $o->room_nights / ($sellableRooms * $daysInM) * 100, 1);
        if (isset($trendMap[$key])) {
            $trendMap[$key]['occupancy'] = $occ;
        } else {
            $trendMap[$key] = ['month' => $o->month, 'revenue' => 0, 'occupancy' => $occ];
        }
    }
    ksort($trendMap);
    $chartData = array_values($trendMap);

    // ── Booking Source Split (Direct vs OTA) ─────────────────────────────────
    $sourceCounts = Booking::selectRaw("
            booking_source,
            COUNT(*) as cnt
        ")
        ->whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
        ->groupBy('booking_source')
        ->get()
        ->keyBy('booking_source');

    $totalConfirmed = max(1, $sourceCounts->sum('cnt'));
    $directCount = (int) ($sourceCounts->get('direct')?->cnt ?? 0)
        + (int) ($sourceCounts->get('walk_in')?->cnt ?? 0);
    $otaCount = (int) ($sourceCounts->get('ota')?->cnt ?? 0);
    $otherCount = $totalConfirmed - $directCount - $otaCount;

    $bookingSourceSplit = [
        ['source' => 'Direct / Walk-in', 'count' => $directCount, 'pct' => round($directCount / $totalConfirmed * 100, 1)],
        ['source' => 'OTA', 'count' => $otaCount, 'pct' => round($otaCount / $totalConfirmed * 100, 1)],
        ['source' => 'Other', 'count' => $otherCount, 'pct' => round($otherCount / $totalConfirmed * 100, 1)],
    ];

    // ── Recent Bookings ───────────────────────────────────────────────────────
    $recentBookings = Booking::with('room:id,room_number,room_type_id', 'room.roomType:id,name')
        ->latest()->limit(5)
        ->get(['id', 'room_id', 'guest_name', 'guest_email', 'check_in_date', 'check_out_date', 'status', 'total_amount', 'booking_source'])
        ->map(fn($b) => [
            'id' => $b->id,
            'guest_name' => $b->guest_name,
            'guest_email' => $b->guest_email,
            'check_in_date' => $b->check_in_date?->format('Y-m-d'),
            'check_out_date' => $b->check_out_date?->format('Y-m-d'),
            'nights' => $b->nights,
            'status' => $b->status,
            'total_amount' => $b->total_amount,
            'booking_source' => $b->booking_source,
            'room_number' => $b->room?->room_number,
            'room_type' => $b->room?->roomType?->name,
        ]);

    return Inertia::render('dashboard', [
        // Section 1 – Business Performance
        'kpi' => [
            'occupancy_rate' => $occupancyRate,
            'monthly_revenue' => (float) $monthlyRevenue,
            'arr' => (float) $arr,
            'revpar' => (float) $revpar,
        ],
        // Section 2 – Operational Snapshot
        'ops' => [
            'total_rooms' => $totalRooms,
            'available_rooms' => $availableRooms,
            'occupied_today' => $occupiedToday,
            'maintenance' => $maintenance,
            'pending_bookings' => $pendingBookings,
        ],
        // Charts
        'chartData' => $chartData,
        'period' => $periodMonths,
        // Strategic Block
        'bookingSourceSplit' => $bookingSourceSplit,
        // Recent Activity
        'recentBookings' => $recentBookings,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


// ── Bookings + Rooms + Calendar + Guests + Payments + Housekeeping (admin+) ─
Route::middleware(['auth', 'verified', 'role:admin,super_admin'])->group(function () {
    // Bookings
    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::patch('bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    // Rooms
    Route::get('rooms', [RoomController::class, 'index'])->name('rooms.index');
    Route::post('rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::patch('rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::delete('rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

    // Calendar (occupancy view)
    Route::get('calendar', [BookingController::class, 'calendar'])->name('calendar.index');

    // Guests (CRM)
    Route::get('guests', [GuestController::class, 'index'])->name('guests.index');
    Route::get('guests/{guest}', [GuestController::class, 'show'])->name('guests.show');
    Route::post('guests', [GuestController::class, 'store'])->name('guests.store');
    Route::patch('guests/{guest}', [GuestController::class, 'update'])->name('guests.update');
    Route::delete('guests/{guest}', [GuestController::class, 'destroy'])->name('guests.destroy');

    // Payments
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::patch('payments/{payment}', [PaymentController::class, 'update'])->name('payments.update');

    // Housekeeping
    Route::get('housekeeping', [HousekeepingController::class, 'index'])->name('housekeeping.index');
    Route::post('housekeeping', [HousekeepingController::class, 'store'])->name('housekeeping.store');
    Route::patch('housekeeping/{housekeepingTask}', [HousekeepingController::class, 'update'])->name('housekeeping.update');
});


// ── User Management (super_admin only) ───────────────────────────────────────
Route::middleware(['auth', 'verified', 'role:super_admin'])->group(function () {
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__ . '/settings.php';
