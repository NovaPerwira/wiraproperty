<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $days = (int) ($request->days ?? 30);
        $from = now()->subDays($days)->startOfDay();

        $totalViews  = PageView::where('viewed_at', '>=', $from)->count();
        $uniqueViews = PageView::where('viewed_at', '>=', $from)->distinct('session_id')->count();

        $topPages = PageView::where('viewed_at', '>=', $from)
            ->select('path', DB::raw('count(*) as views'))
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        $deviceBreakdown = PageView::where('viewed_at', '>=', $from)
            ->select('device', DB::raw('count(*) as count'))
            ->groupBy('device')
            ->get();

        $dailyTrend = PageView::where('viewed_at', '>=', $from)
            ->select(
                DB::raw("date(viewed_at) as date"),
                DB::raw('count(*) as views'),
                DB::raw('count(distinct session_id) as unique_views')
            )
            ->groupBy(DB::raw('date(viewed_at)'))
            ->orderBy('date')
            ->get();

        $topReferrers = PageView::where('viewed_at', '>=', $from)
            ->whereNotNull('referrer')
            ->select('referrer', DB::raw('count(*) as count'))
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return Inertia::render('cms/analytics/index', [
            'stats' => [
                'total_views'   => $totalViews,
                'unique_views'  => $uniqueViews,
                'avg_daily'     => $days > 0 ? round($totalViews / $days) : 0,
            ],
            'topPages'       => $topPages,
            'deviceBreakdown'=> $deviceBreakdown,
            'dailyTrend'     => $dailyTrend,
            'topReferrers'   => $topReferrers,
            'days'           => $days,
        ]);
    }
}
