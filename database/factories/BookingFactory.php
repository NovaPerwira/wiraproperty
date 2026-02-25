<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    private static array $sources = ['direct', 'ota', 'walk_in'];
    private static array $statuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];

    public function definition(): array
    {
        $checkIn = fake()->dateTimeBetween('-3 months', '+2 months');
        $nights = fake()->numberBetween(1, 7);
        $checkOut = (clone $checkIn)->modify("+{$nights} days");

        // Get a random room and compute total from its type price
        $room = Room::with('roomType')->inRandomOrder()->first();
        $total = $room ? ($room->roomType->base_price * $nights) : 0;

        return [
            'room_id' => $room?->id,
            'created_by' => null,
            'guest_name' => fake()->name(),
            'guest_email' => fake()->unique()->safeEmail(),
            'guest_phone' => fake()->numerify('08##-####-####'),
            'guest_address' => fake()->optional(0.6)->address(),
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'status' => fake()->randomElement(self::$statuses),
            'booking_source' => fake()->randomElement(self::$sources),
            'total_amount' => $total,
            'special_requests' => fake()->optional(0.3)->sentence(),
        ];
    }
}
