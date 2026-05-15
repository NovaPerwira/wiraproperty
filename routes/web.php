<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\HousekeepingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Models\Booking;
use App\Models\Room;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// ── Public Routes (tracked) ────────────────────────────────────────────────
Route::middleware([\App\Http\Middleware\TrackPageView::class])->group(function () {
    Route::get('/', function () {
        $homepageSettings = \App\Models\SiteSetting::where('group', 'homepage')->get()->keyBy('key');

        $parseJson = function ($key, $default) use ($homepageSettings) {
            if (!isset($homepageSettings[$key]) || !$homepageSettings[$key]->value)
                return $default;
            return json_decode($homepageSettings[$key]->value, true) ?: $default;
        };

        $get = fn($key, $default) => $homepageSettings[$key]?->value ?? $default;

        return Inertia::render('welcome', [
            'canRegister'     => Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::registration()),
            'heroTitle'       => $get('hero_title', 'Sanctuary of <br class="hidden md:block" /><span class="font-light italic">Elegance.</span>'),
            'heroSubtitle'    => $get('hero_subtitle', 'Curated spaces for the discerning traveler. Find your perfect escape.'),
            'heroImage'       => $get('hero_image', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
            'aboutTitle'      => $get('about_title', 'Where every corner tells <br /> <span class="font-extrabold text-[#1a2320]">a story</span>'),
            'aboutSubtitle'   => $get('about_subtitle', "Explore Nuanu's living journey — where art, nature, and human spirit move together in endless creation."),
            'aboutImage'      => $get('about_image', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
            'stats'           => $parseJson('stats', [
                ['value' => 'IDR 5.6 Billion', 'label' => 'Distribute to impact'],
                ['value' => '94.8%', 'label' => 'Waste recycling rate'],
                ['value' => '14,000+', 'label' => 'Cultural Audiences']
            ]),
            'featuredStays'   => $parseJson('featured_stays', [
                [
                    'id'       => 'stay-1',
                    'title'    => 'Desert Modern Villa',
                    'price'    => 'Rp 4.5M',
                    'beds'     => 2,
                    'image'    => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                    'tag'      => 'Popular',
                    'tagColor' => 'bg-white/90 text-[#1a1a1a]',
                ],
                [
                    'id'       => 'stay-2',
                    'title'    => 'Lakehouse Retreat',
                    'price'    => 'Rp 3.2M',
                    'beds'     => 1,
                    'image'    => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                    'tag'      => 'Free cancellation',
                    'tagColor' => 'bg-white/90 text-[#1a1a1a]',
                ]
            ]),
            'locationTitle'   => $get('location_title', 'Lokasi Strategis di Tabanan'),
            'locationSubtitle'=> $get('location_subtitle', 'Dikelilingi oleh keindahan alam Bali yang otentik, namun tetap mudah dijangkau dari berbagai destinasi populer.'),
            'locationImage'   => $get('location_image', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'),
            'locations'       => $parseJson('locations', [
                ['text' => 'Pantai Kedungu', 'dist' => '10 Menit Berkendara'],
                ['text' => 'Tanah Lot Temple', 'dist' => '15 Menit Berkendara'],
                ['text' => 'Canggu Area', 'dist' => '30 Menit Berkendara'],
                ['text' => 'Bandara Ngurah Rai', 'dist' => '1.5 Jam Berkendara']
            ]),
            'dbFacilities'    => \App\Models\Facility::where('is_active', true)->orderBy('sort_order')->take(4)->get()
        ]);
    })->name('home');

    Route::get('/stays', [PageController::class, 'stays'])->name('page.stays');
    Route::get('/experience', [PageController::class, 'experience'])->name('page.experience');
    Route::get('/dining', [PageController::class, 'dining'])->name('page.dining');
    Route::get('/about', [PageController::class, 'about'])->name('page.about');
    Route::get('/search-rooms', [SearchController::class, 'index'])->name('search.index');
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.index');
});

Route::post('/booking', [CheckoutController::class, 'store'])->name('checkout.store')->middleware('throttle:5,1');

// Public inquiry form
Route::post('/inquiry', [\App\Http\Controllers\Admin\InquiryController::class, 'store'])
    ->name('inquiry.store')
    ->middleware('throttle:5,1');


// ── Dashboard — Hotel Performance Intelligence ─────────────────────────────
Route::middleware(['web', 'admin'])->get('/admin/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');


// ── Admin Routes ────────────────────────────────────────────────────────────
Route::middleware(['web'])->prefix('admin')->group(function () {

    Route::get('/login', [\App\Http\Controllers\Admin\AuthController::class, 'show'])
        ->name('admin.login');

    Route::post('/login', [\App\Http\Controllers\Admin\AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware(['admin'])->group(function () {

        Route::resource('rooms', RoomController::class);
        Route::resource('bookings', BookingController::class);

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

        // User Management
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // ── CMS: Inquiries ────────────────────────────────────────────────
        Route::get('cms/inquiries', [\App\Http\Controllers\Admin\InquiryController::class, 'index'])->name('cms.inquiries.index');
        Route::patch('cms/inquiries/{inquiry}', [\App\Http\Controllers\Admin\InquiryController::class, 'update'])->name('cms.inquiries.update');
        Route::delete('cms/inquiries/{inquiry}', [\App\Http\Controllers\Admin\InquiryController::class, 'destroy'])->name('cms.inquiries.destroy');

        // ── CMS: Gallery ──────────────────────────────────────────────────
        Route::get('cms/gallery', [\App\Http\Controllers\Admin\GalleryController::class, 'index'])->name('cms.gallery.index');
        Route::post('cms/gallery', [\App\Http\Controllers\Admin\GalleryController::class, 'store'])->name('cms.gallery.store');
        Route::patch('cms/gallery/{galleryImage}', [\App\Http\Controllers\Admin\GalleryController::class, 'update'])->name('cms.gallery.update');
        Route::delete('cms/gallery/{galleryImage}', [\App\Http\Controllers\Admin\GalleryController::class, 'destroy'])->name('cms.gallery.destroy');
        Route::post('cms/gallery/reorder', [\App\Http\Controllers\Admin\GalleryController::class, 'reorder'])->name('cms.gallery.reorder');

        // ── CMS: Testimonials ─────────────────────────────────────────────
        Route::get('cms/testimonials', [\App\Http\Controllers\Admin\TestimonialController::class, 'index'])->name('cms.testimonials.index');
        Route::post('cms/testimonials', [\App\Http\Controllers\Admin\TestimonialController::class, 'store'])->name('cms.testimonials.store');
        Route::patch('cms/testimonials/{testimonial}', [\App\Http\Controllers\Admin\TestimonialController::class, 'update'])->name('cms.testimonials.update');
        Route::delete('cms/testimonials/{testimonial}', [\App\Http\Controllers\Admin\TestimonialController::class, 'destroy'])->name('cms.testimonials.destroy');

        // ── CMS: Facilities ───────────────────────────────────────────────
        Route::get('cms/facilities', [\App\Http\Controllers\Admin\FacilityController::class, 'index'])->name('cms.facilities.index');
        Route::post('cms/facilities', [\App\Http\Controllers\Admin\FacilityController::class, 'store'])->name('cms.facilities.store');
        Route::patch('cms/facilities/{facility}', [\App\Http\Controllers\Admin\FacilityController::class, 'update'])->name('cms.facilities.update');
        Route::delete('cms/facilities/{facility}', [\App\Http\Controllers\Admin\FacilityController::class, 'destroy'])->name('cms.facilities.destroy');

        // ── CMS: Pages ────────────────────────────────────────────────────
        Route::get('cms/pages', [\App\Http\Controllers\Admin\PageCmsController::class, 'index'])->name('cms.pages.index');
        Route::get('cms/pages/create', [\App\Http\Controllers\Admin\PageCmsController::class, 'create'])->name('cms.pages.create');
        Route::post('cms/pages', [\App\Http\Controllers\Admin\PageCmsController::class, 'store'])->name('cms.pages.store');
        Route::get('cms/pages/{page}/edit', [\App\Http\Controllers\Admin\PageCmsController::class, 'edit'])->name('cms.pages.edit');
        Route::patch('cms/pages/{page}', [\App\Http\Controllers\Admin\PageCmsController::class, 'update'])->name('cms.pages.update');
        Route::delete('cms/pages/{page}', [\App\Http\Controllers\Admin\PageCmsController::class, 'destroy'])->name('cms.pages.destroy');

        // ── CMS: SEO & Settings ───────────────────────────────────────────
        Route::get('cms/seo', [\App\Http\Controllers\Admin\SeoController::class, 'index'])->name('cms.seo.index');
        Route::patch('cms/seo/{pageKey}', [\App\Http\Controllers\Admin\SeoController::class, 'updateSeo'])->name('cms.seo.update');
        Route::patch('cms/settings', [\App\Http\Controllers\Admin\SeoController::class, 'updateSettings'])->name('cms.settings.update');

        // ── CMS: Homepage ─────────────────────────────────────────────────
        Route::get('cms/homepage', [\App\Http\Controllers\Admin\HomepageController::class, 'index'])->name('cms.homepage.index');
        Route::patch('cms/homepage', [\App\Http\Controllers\Admin\HomepageController::class, 'update'])->name('cms.homepage.update');

        // ── CMS: Stays Page ───────────────────────────────────────────────
        Route::get('cms/stays', [\App\Http\Controllers\Admin\StaysCmsController::class, 'index'])->name('cms.stays.index');
        Route::patch('cms/stays', [\App\Http\Controllers\Admin\StaysCmsController::class, 'update'])->name('cms.stays.update');

        // ── CMS: Experience Page ──────────────────────────────────────────
        Route::get('cms/experience', [\App\Http\Controllers\Admin\ExperienceCmsController::class, 'index'])->name('cms.experience.index');
        Route::patch('cms/experience', [\App\Http\Controllers\Admin\ExperienceCmsController::class, 'update'])->name('cms.experience.update');

        // ── CMS: Dining Page ─────────────────────────────────────────────
        Route::get('cms/dining', [\App\Http\Controllers\Admin\DiningCmsController::class, 'index'])->name('cms.dining.index');
        Route::patch('cms/dining', [\App\Http\Controllers\Admin\DiningCmsController::class, 'update'])->name('cms.dining.update');

        // ── CMS: About Page ──────────────────────────────────────────────
        Route::get('cms/about', [\App\Http\Controllers\Admin\AboutCmsController::class, 'index'])->name('cms.about.index');
        Route::patch('cms/about', [\App\Http\Controllers\Admin\AboutCmsController::class, 'update'])->name('cms.about.update');

        // ── CMS: Analytics ────────────────────────────────────────────────
        Route::get('cms/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('cms.analytics.index');

        // ── CMS: Availability ─────────────────────────────────────────────
        Route::get('cms/availability', [\App\Http\Controllers\Admin\AvailabilityController::class, 'index'])->name('cms.availability.index');
        Route::post('cms/availability/blocks', [\App\Http\Controllers\Admin\AvailabilityController::class, 'storeBlock'])->name('cms.availability.block');
        Route::delete('cms/availability/blocks/{block}', [\App\Http\Controllers\Admin\AvailabilityController::class, 'destroyBlock'])->name('cms.availability.unblock');
    });

});

require __DIR__ . '/settings.php';
