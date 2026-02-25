<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    private static array $methods = ['cash', 'transfer', 'credit_card', 'debit_card', 'ota'];
    private static array $statuses = ['pending', 'paid', 'partial', 'refunded'];

    public function definition(): array
    {
        $status = fake()->randomElement(self::$statuses);
        $isPaid = in_array($status, ['paid', 'partial']);
        $booking = Booking::inRandomOrder()->first();

        return [
            'booking_id' => $booking?->id,
            'recorded_by' => User::inRandomOrder()->value('id'),
            'amount' => $booking
                ? round($booking->total_amount * fake()->randomFloat(2, 0.5, 1.0), -3)
                : fake()->numberBetween(150000, 2000000),
            'payment_method' => fake()->randomElement(self::$methods),
            'payment_status' => $status,
            'paid_at' => $isPaid ? fake()->dateTimeBetween('-3 months', 'now') : null,
            'reference_number' => $isPaid ? fake()->optional(0.6)->bothify('TRF-####??') : null,
            'notes' => fake()->optional(0.2)->sentence(),
        ];
    }

    public function paid(): static
    {
        return $this->state(fn() => [
            'payment_status' => 'paid',
            'paid_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ]);
    }
}
