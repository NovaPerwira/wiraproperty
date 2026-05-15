<?php

namespace App\Http\Middleware;

use App\Models\PageView;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track GET requests for public HTML pages
        if (
            $request->isMethod('GET') &&
            ! $request->is('admin/*') &&
            ! $request->is('api/*') &&
            ! $request->expectsJson() &&
            $response->isSuccessful()
        ) {
            $ua = $request->userAgent() ?? '';
            $device = match (true) {
                str_contains(strtolower($ua), 'mobile')  => 'mobile',
                str_contains(strtolower($ua), 'tablet')  => 'tablet',
                default                                  => 'desktop',
            };

            // Don't track bots
            if (! preg_match('/bot|crawl|spider|slurp|facebookexternalhit/i', $ua)) {
                PageView::create([
                    'path'       => $request->path(),
                    'referrer'   => $request->header('referer'),
                    'ip'         => $request->ip(),
                    'user_agent' => substr($ua, 0, 500),
                    'device'     => $device,
                    'session_id' => substr(session()->getId(), 0, 64),
                    'viewed_at'  => now(),
                ]);
            }
        }

        return $response;
    }
}
