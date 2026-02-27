<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();
        $periodWeeks = max(4, min(26, (int) request()->input('period', 12))); // 4–26 weeks
        $perPage = max(5, min(50, (int) request()->input('per_page', 10)));
        $page = max(1, (int) request()->input('page', 1));

        // ── Date windows ─────────────────────────────────────────────────────────
        $thisMonthStart = now()->startOfMonth()->toDateString();
        $thisMonthEnd = now()->endOfMonth()->toDateString();
        $prevMonth = now()->subMonthNoOverflow();
        $prevMonthStart = $prevMonth->copy()->startOfMonth()->toDateString();
        $prevMonthEnd = $prevMonth->copy()->endOfMonth()->toDateString();
        $weekStart = now()->subWeeks($periodWeeks - 1)->startOfWeek()->toDateString();

        // ── BATCH 1: Room inventory (single query) ────────────────────────────────
        $roomStats = \App\Models\Room::selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
            ")->first();

        $totalRooms = (int) ($roomStats->total ?? 0);
        $maintenance = (int) ($roomStats->maintenance ?? 0);
        $sellableRooms = max(1, $totalRooms - $maintenance);

        // Occupied today — rooms with active booking overlapping today
        $occupiedToday = \App\Models\Booking::whereIn('status', ['confirmed', 'checked_in'])
            ->where('check_in_date', '<=', $today)
            ->where('check_out_date', '>', $today)
            ->whereNotNull('room_id')
            ->distinct('room_id')
            ->count('room_id');

        // ── Business Performance KPIs ────────────────────────────────────────────
        $daysInMonth = (int) now()->daysInMonth;

        $monthMetrics = function (string $start, string $end) {
            $revenue = \App\Models\Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
                ->whereBetween('check_in_date', [$start, $end])->sum('total_amount');
            $sold = \App\Models\Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
                ->whereBetween('check_in_date', [$start, $end])->count();
            return ['revenue' => (float) $revenue, 'sold' => (int) $sold];
        };

        $monthOccupancy = function (string $start, string $end, int $sellable) {
            $roomNights = \App\Models\Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
                ->whereBetween('check_in_date', [$start, $end])
                ->selectRaw('SUM(DATEDIFF(LEAST(check_out_date, ?), GREATEST(check_in_date, ?))) as rn', [$end, $start])
                ->value('rn') ?? 0;
            $daysInM = (int) \Carbon\Carbon::parse($start)->daysInMonth;
            return $daysInM > 0 ? round((float) $roomNights / ($sellable * $daysInM) * 100, 1) : 0;
        };

        $delta = function ($now, $prev): array {
            if ($prev == 0) {
                return ['pct' => $now > 0 ? 100.0 : 0.0, 'dir' => $now > 0 ? 'up' : 'neutral'];
            }
            $pct = round(($now - $prev) / $prev * 100, 1);
            return ['pct' => abs($pct), 'dir' => $pct >= 0 ? 'up' : 'down'];
        };

        $thisM = $monthMetrics($thisMonthStart, $thisMonthEnd);
        $prevM = $monthMetrics($prevMonthStart, $prevMonthEnd);

        $thisRevenue = $thisM['revenue'];
        $prevRevenue = $prevM['revenue'];
        $thisARR = $thisM['sold'] > 0 ? round($thisRevenue / $thisM['sold']) : 0;
        $prevARR = $prevM['sold'] > 0 ? round($prevRevenue / $prevM['sold']) : 0;
        $prevDays = (int) \Carbon\Carbon::parse($prevMonthStart)->daysInMonth;
        $thisRevPAR = round($thisRevenue / ($sellableRooms * $daysInMonth));
        $prevRevPAR = round($prevRevenue / ($sellableRooms * $prevDays));
        $thisOccupancy = round($occupiedToday / $sellableRooms * 100, 1);
        $prevOccupancy = $monthOccupancy($prevMonthStart, $prevMonthEnd, $sellableRooms);

        $kpi = [
            'occupancy_rate' => ['value' => $thisOccupancy, 'prev' => $prevOccupancy, ...$delta($thisOccupancy, $prevOccupancy)],
            'monthly_revenue' => ['value' => $thisRevenue, 'prev' => $prevRevenue, ...$delta($thisRevenue, $prevRevenue)],
            'arr' => ['value' => (float) $thisARR, 'prev' => (float) $prevARR, ...$delta($thisARR, $prevARR)],
            'revpar' => ['value' => (float) $thisRevPAR, 'prev' => (float) $prevRevPAR, ...$delta($thisRevPAR, $prevRevPAR)],
        ];

        // ── BATCH 3: Ops snapshot ─────────────────────────────────────────────────
        $pendingCount = \App\Models\Booking::where('status', 'pending')->count();
        $ops = [
            'total_rooms' => $totalRooms,
            'available_rooms' => max(0, $sellableRooms - $occupiedToday),
            'occupied_today' => $occupiedToday,
            'maintenance' => $maintenance,
            'pending_bookings' => $pendingCount,
        ];

        // ── BATCH 4: Channel revenue + all-time counts ────
        $OTA_RATE = 0.15;

        // One optimized query for channel revenue/counts
        $channelStats = \App\Models\Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
            ->selectRaw("
                SUM(CASE WHEN booking_source IN ('direct', 'walk_in') THEN 1 ELSE 0 END) as direct_cnt_all,
                SUM(CASE WHEN booking_source = 'ota' THEN 1 ELSE 0 END) as ota_cnt_all,
                COUNT(*) as total_cnt_all,
                
                SUM(CASE WHEN booking_source IN ('direct', 'walk_in') AND check_in_date BETWEEN ? AND ? THEN total_amount ELSE 0 END) as direct_rev_m,
                SUM(CASE WHEN booking_source = 'ota' AND check_in_date BETWEEN ? AND ? THEN total_amount ELSE 0 END) as ota_rev_m,
                SUM(CASE WHEN booking_source NOT IN ('direct', 'walk_in', 'ota') AND check_in_date BETWEEN ? AND ? THEN total_amount ELSE 0 END) as other_rev_m
            ", [$thisMonthStart, $thisMonthEnd, $thisMonthStart, $thisMonthEnd, $thisMonthStart, $thisMonthEnd])
            ->first();

        $directRevM = (float) ($channelStats->direct_rev_m ?? 0);
        $otaRevM = (float) ($channelStats->ota_rev_m ?? 0);
        $otherRevM = (float) ($channelStats->other_rev_m ?? 0);
        $totalRevM = max(1, $directRevM + $otaRevM + $otherRevM);

        $allTotal = max(1, (int) ($channelStats->total_cnt_all ?? 0));
        $directCnt = (int) ($channelStats->direct_cnt_all ?? 0);
        $otaCnt = (int) ($channelStats->ota_cnt_all ?? 0);
        $otherCnt = $allTotal - $directCnt - $otaCnt;

        $otaCommission = round($otaRevM * $OTA_RATE);
        $netRevenue = round($thisRevenue - $otaCommission);

        $channelData = [
            [
                'source' => 'Direct / Walk-in',
                'revenue' => $directRevM,
                'count' => $directCnt,
                'rev_pct' => round($directRevM / $totalRevM * 100, 1),
                'cnt_pct' => round($directCnt / $allTotal * 100, 1),
                'commission' => 0
            ],
            [
                'source' => 'OTA',
                'revenue' => $otaRevM,
                'count' => $otaCnt,
                'rev_pct' => round($otaRevM / $totalRevM * 100, 1),
                'cnt_pct' => round($otaCnt / $allTotal * 100, 1),
                'commission' => $otaCommission
            ],
            [
                'source' => 'Other',
                'revenue' => $otherRevM,
                'count' => $otherCnt,
                'rev_pct' => round($otherRevM / $totalRevM * 100, 1),
                'cnt_pct' => round($otherCnt / $allTotal * 100, 1),
                'commission' => 0
            ],
        ];

        $commissionSummary = [
            'ota_revenue' => $otaRevM,
            'commission_rate' => $OTA_RATE * 100,
            'ota_commission' => (float) $otaCommission,
            'net_revenue' => (float) $netRevenue,
            'gross_revenue' => $thisRevenue,
        ];

        // ── BATCH 5: Cancellation (single query, 2 passes in PHP) ────────────────
        $cancelStats = \App\Models\Booking::selectRaw("
                booking_source,
                COUNT(*) AS total,
                SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled
            ")
            ->where('check_in_date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('booking_source')
            ->get();

        $totalBookings = (int) $cancelStats->sum('total');
        $totalCancelled = (int) $cancelStats->sum('cancelled');
        $cancelRate = $totalBookings > 0 ? round($totalCancelled / $totalBookings * 100, 1) : 0;
        $cancelByChannel = $cancelStats->map(fn($r) => [
            'source' => $r->booking_source,
            'total' => (int) $r->total,
            'cancelled' => (int) $r->cancelled,
            'rate' => $r->total > 0 ? round($r->cancelled / $r->total * 100, 1) : 0,
        ])->values();

        // Simplified week label approach — cleaner and avoids MySQL date-string quirks
        $weeklyData = \App\Models\Booking::selectRaw("
                YEARWEEK(check_in_date, 1)                                                AS yw,
                DATE_FORMAT(MIN(check_in_date),'Wk %%u')                                 AS week_label,
                COALESCE(SUM(CASE WHEN status IN ('confirmed','checked_in','checked_out') THEN total_amount ELSE 0 END),0) AS revenue,
                COUNT(*)                                                                   AS total_bookings,
                COALESCE(SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END),0)          AS cancelled
            ")
            ->where('check_in_date', '>=', $weekStart)
            ->groupByRaw('YEARWEEK(check_in_date, 1)')
            ->orderByRaw('YEARWEEK(check_in_date, 1)')
            ->get()
            ->map(function ($r) use ($sellableRooms) {
                $occ = $sellableRooms * 7 > 0
                    ? round(min((int) $r->total_bookings / ($sellableRooms * 7) * 100, 100), 1)
                    : 0;
                $cancelRate = $r->total_bookings > 0
                    ? round($r->cancelled / $r->total_bookings * 100, 1)
                    : 0;
                return [
                    'week' => $r->week_label,
                    'revenue' => (float) $r->revenue,
                    'occupancy' => $occ,
                    'cancel_rate' => $cancelRate,
                    'bookings' => (int) $r->total_bookings,
                    'cancelled' => (int) $r->cancelled,
                ];
            });

        // Cancellation weekly trend (reuse weeklyData)
        $cancellationData = [
            'total_bookings' => $totalBookings,
            'total_cancelled' => $totalCancelled,
            'cancel_rate' => $cancelRate,
            'by_channel' => $cancelByChannel,
            'trend' => $weeklyData->map(fn($w) => [
                'month' => $w['week'],
                'total' => $w['bookings'],
                'cancelled' => $w['cancelled'],
                'cancel_rate' => $w['cancel_rate'],
            ]),
        ];

        // ── Rule-Based Performance Insights ──────────────────────────────────────
        $insights = [];
        $otaPct = round($otaCnt / $allTotal * 100, 1);
        $revDelta = $kpi['monthly_revenue'];
        $arrDelta = $kpi['arr'];

        if ($thisOccupancy < 40) {
            $insights[] = [
                'level' => 'warning',
                'icon' => '🏚️',
                'title' => 'insight.occ_low_title',
                'message' => "insight.occ_low_msg:{$thisOccupancy}"
            ];
        } elseif ($thisOccupancy >= 85) {
            $insights[] = [
                'level' => 'success',
                'icon' => '🔥',
                'title' => 'insight.occ_high_title',
                'message' => "insight.occ_high_msg:{$thisOccupancy}"
            ];
        }
        if ($otaPct > 50) {
            $annualComm = round($otaCommission * 12);
            $insights[] = [
                'level' => 'warning',
                'icon' => '📡',
                'title' => 'insight.ota_dep_title',
                'message' => "insight.ota_dep_msg:{$otaPct}:{$otaCommission}:{$annualComm}"
            ];
        } elseif ($directCnt / $allTotal > 0.5) {
            $directPct = round($directCnt / $allTotal * 100, 1);
            $insights[] = [
                'level' => 'success',
                'icon' => '🎯',
                'title' => 'insight.direct_title',
                'message' => "insight.direct_msg:{$directPct}"
            ];
        }
        if ($revDelta['dir'] === 'down' && $revDelta['pct'] > 10) {
            $insights[] = [
                'level' => 'error',
                'icon' => '📉',
                'title' => 'insight.rev_drop_title',
                'message' => "insight.rev_drop_msg:{$revDelta['pct']}"
            ];
        } elseif ($revDelta['dir'] === 'up' && $revDelta['pct'] > 15) {
            $insights[] = [
                'level' => 'success',
                'icon' => '🚀',
                'title' => 'insight.rev_grow_title',
                'message' => "insight.rev_grow_msg:{$revDelta['pct']}"
            ];
        }
        if ($cancelRate > 20) {
            $insights[] = [
                'level' => 'error',
                'icon' => '❌',
                'title' => 'insight.cancel_high_title',
                'message' => "insight.cancel_high_msg:{$cancelRate}"
            ];
        } elseif ($cancelRate > 10) {
            $insights[] = [
                'level' => 'warning',
                'icon' => '⚠️',
                'title' => 'insight.cancel_mid_title',
                'message' => "insight.cancel_mid_msg:{$cancelRate}"
            ];
        }
        if ($arrDelta['dir'] === 'down' && $arrDelta['pct'] > 5) {
            $insights[] = [
                'level' => 'info',
                'icon' => '🏷️',
                'title' => 'insight.arr_drop_title',
                'message' => "insight.arr_drop_msg:{$arrDelta['pct']}"
            ];
        }
        if (empty($insights)) {
            $insights[] = [
                'level' => 'success',
                'icon' => '✅',
                'title' => 'insight.normal_title',
                'message' => 'insight.normal_msg'
            ];
        }

        // ── BATCH 7: Recent bookings with pagination ───────────────────────────────
        $bookingQuery = \App\Models\Booking::with([
            'room:id,room_number,room_type_id',
            'room.roomType:id,name',
        ])
            ->latest()
            ->select(['id', 'room_id', 'guest_name', 'guest_email', 'check_in_date', 'check_out_date', 'status', 'total_amount', 'booking_source']);

        $totalBookingCount = $bookingQuery->count();
        $recentBookings = $bookingQuery
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get()
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
            'kpi' => $kpi,
            'ops' => $ops,
            'channelData' => $channelData,
            'commissionSummary' => $commissionSummary,
            'cancellationData' => $cancellationData,
            'insights' => $insights,
            'chartData' => $weeklyData->values(),
            'periodWeeks' => $periodWeeks,
            'recentBookings' => $recentBookings,
            'pagination' => [
                'total' => $totalBookingCount,
                'per_page' => $perPage,
                'page' => $page,
                'last_page' => (int) ceil($totalBookingCount / $perPage),
            ],
        ]);
    }
}
