<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guest>
 */
class GuestFactory extends Factory
{
    private static array $nationalities = ['Indonesia', 'Malaysia', 'Singapore', 'Australia', 'Belanda', 'Jerman', 'Jepang', 'Korea'];

    private static array $preferencePool = [
        'non_smoking' => 'Non-smoking',
        'honeymoon' => 'Honeymoon Setup',
        'extra_pillow' => 'Extra Pillow',
        'high_floor' => 'High Floor',
        'quiet_room' => 'Quiet Room',
        'early_checkin' => 'Early Check-in',
        'late_checkout' => 'Late Check-out',
        'vegan_food' => 'Vegan Food',
        'baby_crib' => 'Baby Crib',
    ];

    public function definition(): array
    {
        // Pick 0–3 random preferences
        $keys = fake()->randomElements(
            array_keys(self::$preferencePool),
            fake()->numberBetween(0, 3)
        );
        $prefs = [];
        foreach ($keys as $key) {
            $prefs[$key] = self::$preferencePool[$key];
        }

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('08##-####-####'),
            'address' => fake()->optional(0.7)->address(),
            'id_number' => fake()->optional(0.6)->numerify('################'),
            'nationality' => fake()->randomElement(self::$nationalities),
            'date_of_birth' => fake()->optional(0.5)->dateTimeBetween('-70 years', '-18 years'),
            'preferences' => empty($prefs) ? null : $prefs,
            'notes' => fake()->optional(0.2)->sentence(),
            'is_blacklisted' => false,
            'blacklist_reason' => null,
            'total_bookings' => 0,
            'total_spend' => 0,
        ];
    }

    public function blacklisted(): static
    {
        return $this->state(fn() => [
            'is_blacklisted' => true,
            'blacklist_reason' => fake()->randomElement([
                'No-show tanpa konfirmasi 3x',
                'Kerusakan properti',
                'Pembayaran tidak sah',
                'Review palsu & ancaman',
            ]),
        ]);
    }
}
