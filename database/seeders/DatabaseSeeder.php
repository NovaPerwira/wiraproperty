<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\HousekeepingTask;
use App\Models\Payment;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ─────────────────────────────────────────────────────────────
        User::factory()->create(['name' => 'Super Admin', 'email' => 'superadmin@demo.com', 'password' => Hash::make('password'), 'role' => 'super_admin', 'email_verified_at' => now()]);
        User::factory()->create(['name' => 'Admin User', 'email' => 'admin@demo.com', 'password' => Hash::make('password'), 'role' => 'admin', 'email_verified_at' => now()]);
        User::factory()->create(['name' => 'Jane Manager', 'email' => 'manager@demo.com', 'password' => Hash::make('password'), 'role' => 'admin', 'email_verified_at' => now()]);
        User::factory()->create(['name' => 'Staff User', 'email' => 'staff@demo.com', 'password' => Hash::make('password'), 'role' => 'staff', 'email_verified_at' => now()]);

        // ── Room Types ────────────────────────────────────────────────────────
        $types = [
            RoomType::create(['name' => 'Standard', 'description' => 'Cozy standard room with city view.', 'base_price' => 350000, 'capacity' => 2, 'amenities' => ['WiFi', 'AC', 'TV']]),
            RoomType::create(['name' => 'Deluxe', 'description' => 'Spacious deluxe room with premium furnishings.', 'base_price' => 550000, 'capacity' => 2, 'amenities' => ['WiFi', 'AC', 'TV', 'Mini Bar', 'City View']]),
            RoomType::create(['name' => 'Suite', 'description' => 'Luxurious suite with separate lounge area.', 'base_price' => 950000, 'capacity' => 3, 'amenities' => ['WiFi', 'AC', 'TV', 'Bathtub', 'Mini Bar', 'Lounge Area']]),
            RoomType::create(['name' => 'Family', 'description' => 'Large family room with extra beds.', 'base_price' => 750000, 'capacity' => 4, 'amenities' => ['WiFi', 'AC', '2x TV', 'Extra Beds']]),
        ];

        // ── Rooms (4 floors, grouped by type) ────────────────────────────────
        $roomData = [
            // Floor 1 — Standard (101–108)
            ...$this->makeRooms($types[0]->id, 1, range(1, 8)),
            // Floor 2 — Deluxe (201–206)
            ...$this->makeRooms($types[1]->id, 2, range(1, 6)),
            // Floor 3 — Suite (301–304)
            ...$this->makeRooms($types[2]->id, 3, range(1, 4)),
            // Floor 4 — Family (401–404)
            ...$this->makeRooms($types[3]->id, 4, range(1, 4)),
        ];

        foreach ($roomData as $room) {
            Room::create($room);
        }

        // Mark a couple under maintenance for realism
        Room::where('room_number', '103')->update(['status' => 'maintenance', 'notes' => 'Bathroom renovation']);
        Room::where('room_number', '301')->update(['status' => 'maintenance', 'notes' => 'AC unit replacement']);

        // ── Guests ────────────────────────────────────────────────────────────
        Guest::factory(35)->create();
        Guest::factory(3)->blacklisted()->create();

        // ── Bookings ──────────────────────────────────────────────────────────
        // Create 80 bookings, linking ~60% to a guest profile
        $guests = Guest::all();
        Booking::factory(80)->create()->each(function (Booking $booking) use ($guests) {
            if (fake()->boolean(60)) {
                $booking->updateQuietly(['guest_id' => $guests->random()->id]);
            }
        });

        // ── Payments ──────────────────────────────────────────────────────────
        // Create 1–2 payments for 60 random bookings
        $bookings = Booking::whereIn('status', ['confirmed', 'checked_in', 'checked_out'])->get();
        foreach ($bookings->take(60) as $booking) {
            Payment::create([
                'booking_id' => $booking->id,
                'recorded_by' => User::inRandomOrder()->value('id'),
                'amount' => $booking->total_amount,
                'payment_method' => fake()->randomElement(['cash', 'transfer', 'credit_card', 'debit_card', 'ota']),
                'payment_status' => 'paid',
                'paid_at' => $booking->check_in_date ?? now()->subDays(rand(1, 60)),
                'reference_number' => fake()->optional(0.5)->bothify('TRF-####??'),
                'notes' => null,
            ]);
        }

        // Pending payments for 10 pending bookings
        $pendingBookings = Booking::where('status', 'pending')->take(10)->get();
        foreach ($pendingBookings as $booking) {
            Payment::create([
                'booking_id' => $booking->id,
                'recorded_by' => User::inRandomOrder()->value('id'),
                'amount' => $booking->total_amount,
                'payment_method' => fake()->randomElement(['transfer', 'ota']),
                'payment_status' => 'pending',
                'paid_at' => null,
                'reference_number' => null,
                'notes' => 'Menunggu konfirmasi pembayaran',
            ]);
        }

        // ── Housekeeping Tasks ─────────────────────────────────────────────────
        $rooms = Room::all();
        $today = now()->toDateString();
        $users = User::all();

        foreach ($rooms as $room) {
            // Today's cleaning task for every room
            HousekeepingTask::create([
                'room_id' => $room->id,
                'assigned_to' => $users->random()->id,
                'task_type' => 'cleaning',
                'status' => $room->status === 'maintenance' ? 'skipped' : fake()->randomElement(['pending', 'pending', 'in_progress', 'done']),
                'priority' => fake()->randomElement(['normal', 'normal', 'urgent']),
                'notes' => null,
                'scheduled_for' => $today,
                'completed_at' => null,
            ]);
        }

        // A few maintenance alerts
        HousekeepingTask::create([
            'room_id' => Room::where('room_number', '103')->value('id'),
            'task_type' => 'maintenance',
            'status' => 'in_progress',
            'priority' => 'urgent',
            'notes' => 'Bathroom renovation - plumber scheduled 10:00',
            'scheduled_for' => $today,
        ]);
        HousekeepingTask::create([
            'room_id' => Room::where('room_number', '301')->value('id'),
            'task_type' => 'maintenance',
            'status' => 'pending',
            'priority' => 'urgent',
            'notes' => 'AC unit replacement - waiting for parts',
            'scheduled_for' => $today,
        ]);

        // ── Refresh guest counters ─────────────────────────────────────────────
        Guest::all()->each(fn(Guest $g) => $g->recalculateCounters());
    }

    private function makeRooms(int $typeId, int $floor, array $nums): array
    {
        return array_map(fn($n) => [
            'room_type_id' => $typeId,
            'room_number' => "{$floor}0{$n}",
            'floor' => $floor,
            'status' => 'available',
            'notes' => null,
        ], $nums);
    }
}
