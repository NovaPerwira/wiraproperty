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
            'heroImage'       => $get('hero_image', '/img/villa.png'),
            'aboutTitle'      => $get('about_title', 'Where every corner tells <br /> <span class="font-extrabold text-[#1a2320]">a story</span>'),
            'aboutSubtitle'   => $get('about_subtitle', "Explore Nuanu's living journey — where art, nature, and human spirit move together in endless creation."),
            'aboutImage'      => $get('about_image', '/img/rumah.png'),
            'galleryItems'    => \App\Models\SiteSetting::where('group', 'gallery_section')->where('key', 'items')->first() ? json_decode(\App\Models\SiteSetting::where('group', 'gallery_section')->where('key', 'items')->first()->value, true) : null,
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
                    'image'    => '/img/villa.png',
                    'tag'      => 'Popular',
                    'tagColor' => 'bg-white/90 text-[#1a1a1a]',
                ],
                [
                    'id'       => 'stay-2',
                    'title'    => 'Lakehouse Retreat',
                    'price'    => 'Rp 3.2M',
                    'beds'     => 1,
                    'image'    => '/img/rumah.png',
                    'tag'      => 'Free cancellation',
                    'tagColor' => 'bg-white/90 text-[#1a1a1a]',
                ]
            ]),
            'locationTitle'   => $get('location_title', 'Lokasi Strategis di Tabanan'),
            'locationSubtitle'=> $get('location_subtitle', 'Dikelilingi oleh keindahan alam Bali yang otentik, namun tetap mudah dijangkau dari berbagai destinasi populer.'),
            'locationImage'   => $get('location_image', '/img/tanah.png'),
            'locations'       => $parseJson('locations', [
                ['text' => 'Pantai Kedungu', 'dist' => '10 Menit Berkendara'],
                ['text' => 'Tanah Lot Temple', 'dist' => '15 Menit Berkendara'],
                ['text' => 'Canggu Area', 'dist' => '30 Menit Berkendara'],
                ['text' => 'Bandara Ngurah Rai', 'dist' => '1.5 Jam Berkendara']
            ]),
            'dbFacilities'    => \App\Models\Facility::where('is_active', true)->orderBy('sort_order')->take(4)->get()->whenEmpty(function () {
                return collect([
                    ['id' => 1, 'name' => 'Wi-Fi Berkecepatan Tinggi', 'description' => 'Gratis di seluruh area', 'icon' => 'wifi'],
                    ['id' => 2, 'name' => 'Infinity Pool', 'description' => 'Pemandangan menakjubkan', 'icon' => 'map'],
                    ['id' => 3, 'name' => 'Restoran & Bar', 'description' => 'Sajian lokal & internasional', 'icon' => 'coffee'],
                    ['id' => 4, 'name' => 'Keamanan 24/7', 'description' => 'Ketenangan pikiran Anda', 'icon' => 'shield'],
                ]);
            })
        ]);
    })->name('home');

    Route::get('/stays', [PageController::class, 'stays'])->name('page.stays');
    Route::get('/experience', [PageController::class, 'experience'])->name('page.experience');
    Route::get('/dining', [PageController::class, 'dining'])->name('page.dining');
    Route::get('/about', [PageController::class, 'about'])->name('page.about');
    Route::get('/search-rooms', [SearchController::class, 'index'])->name('search.index');
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.index');

    // ── Villa Routes ───────────────────────────────────────────────────────
    Route::get('/villa/bali', [PageController::class, 'villaBali'])->name('page.villa.bali');
    Route::get('/villa/lombok', [PageController::class, 'villaLombok'])->name('page.villa.lombok');

    // ── Property Routes ────────────────────────────────────────────────────
    Route::get('/property/rumah', [PageController::class, 'propertyRumah'])->name('page.property.rumah');
    Route::get('/property/ruko', [PageController::class, 'propertyRuko'])->name('page.property.ruko');
    Route::get('/property/villa', [PageController::class, 'propertyVilla'])->name('page.property.villa');

    // ── Tanah Route ────────────────────────────────────────────────────────
    Route::get('/tanah', [PageController::class, 'tanah'])->name('page.tanah');
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

        // Properties CRUD
        Route::get('properties/villa', [\App\Http\Controllers\Admin\PropertyController::class, 'villa'])->name('properties.villa');
        Route::get('properties/general', [\App\Http\Controllers\Admin\PropertyController::class, 'general'])->name('properties.general');
        Route::get('properties/tanah', [\App\Http\Controllers\Admin\PropertyController::class, 'tanah'])->name('properties.tanah');
        Route::post('properties', [\App\Http\Controllers\Admin\PropertyController::class, 'store'])->name('properties.store');
        Route::patch('properties/{property}', [\App\Http\Controllers\Admin\PropertyController::class, 'update'])->name('properties.update');
        Route::delete('properties/{property}', [\App\Http\Controllers\Admin\PropertyController::class, 'destroy'])->name('properties.destroy');

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

        // ── CMS: Gallery Section ───────────────────────────────────────────
        Route::get('cms/gallery-section', [\App\Http\Controllers\Admin\GallerySectionController::class, 'index'])->name('cms.gallery_section.index');
        Route::post('cms/gallery-section', [\App\Http\Controllers\Admin\GallerySectionController::class, 'update'])->name('cms.gallery_section.update');

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

        // ── CMS: Villa Pages ──────────────────────────────────────────────
        Route::get('cms/villa/bali', [\App\Http\Controllers\Admin\VillaCmsController::class, 'bali'])->name('cms.villa.bali.index');
        Route::patch('cms/villa/bali', [\App\Http\Controllers\Admin\VillaCmsController::class, 'updateBali'])->name('cms.villa.bali.update');
        Route::get('cms/villa/lombok', [\App\Http\Controllers\Admin\VillaCmsController::class, 'lombok'])->name('cms.villa.lombok.index');
        Route::patch('cms/villa/lombok', [\App\Http\Controllers\Admin\VillaCmsController::class, 'updateLombok'])->name('cms.villa.lombok.update');

        // ── CMS: Property Pages ───────────────────────────────────────────
        Route::get('cms/property/rumah', [\App\Http\Controllers\Admin\PropertyCmsController::class, 'rumah'])->name('cms.property.rumah.index');
        Route::patch('cms/property/rumah', [\App\Http\Controllers\Admin\PropertyCmsController::class, 'updateRumah'])->name('cms.property.rumah.update');
        Route::get('cms/property/ruko', [\App\Http\Controllers\Admin\PropertyCmsController::class, 'ruko'])->name('cms.property.ruko.index');
        Route::patch('cms/property/ruko', [\App\Http\Controllers\Admin\PropertyCmsController::class, 'updateRuko'])->name('cms.property.ruko.update');
        Route::get('cms/property/villa', [\App\Http\Controllers\Admin\PropertyCmsController::class, 'villa'])->name('cms.property.villa.index');
        Route::patch('cms/property/villa', [\App\Http\Controllers\Admin\PropertyCmsController::class, 'updateVilla'])->name('cms.property.villa.update');

        // ── CMS: Tanah Page ───────────────────────────────────────────────
        Route::get('cms/tanah', [\App\Http\Controllers\Admin\TanahCmsController::class, 'index'])->name('cms.tanah.index');
        Route::patch('cms/tanah', [\App\Http\Controllers\Admin\TanahCmsController::class, 'update'])->name('cms.tanah.update');

        // ── CMS: Analytics ────────────────────────────────────────────────
        Route::get('cms/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('cms.analytics.index');

        // ── CMS: Availability ─────────────────────────────────────────────
        Route::get('cms/availability', [\App\Http\Controllers\Admin\AvailabilityController::class, 'index'])->name('cms.availability.index');
        Route::post('cms/availability/blocks', [\App\Http\Controllers\Admin\AvailabilityController::class, 'storeBlock'])->name('cms.availability.block');
        Route::delete('cms/availability/blocks/{block}', [\App\Http\Controllers\Admin\AvailabilityController::class, 'destroyBlock'])->name('cms.availability.unblock');
    });

});

require __DIR__ . '/settings.php';
