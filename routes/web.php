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
use App\Http\Controllers\PageController; // Added this line
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Fronted Pages Routes
Route::get('/stays', [PageController::class, 'stays'])->name('page.stays');
Route::get('/experience', [PageController::class, 'experience'])->name('page.experience');
Route::get('/dining', [PageController::class, 'dining'])->name('page.dining');
Route::get('/about', [PageController::class, 'about'])->name('page.about');

Route::get('/search-rooms', [SearchController::class, 'index'])->name('search.index');

Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.index');
Route::post('/booking', [CheckoutController::class, 'store'])->name('checkout.store')->middleware('throttle:5,1');


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
    });

});

require __DIR__ . '/settings.php';
