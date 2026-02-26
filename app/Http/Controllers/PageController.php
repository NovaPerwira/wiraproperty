<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\RoomType;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Show the main rooms/stays public page.
     */
    public function stays(): Response
    {
        $roomTypes = RoomType::orderBy('base_price')->get();
        return Inertia::render('stays', [
            'roomTypes' => $roomTypes
        ]);
    }

    /**
     * Show the Experience public page.
     */
    public function experience(): Response
    {
        return Inertia::render('experience');
    }

    /**
     * Show the Dining public page.
     */
    public function dining(): Response
    {
        return Inertia::render('dining');
    }

    /**
     * Show the About public page.
     */
    public function about(): Response
    {
        return Inertia::render('about');
    }
}
