<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomType>
 */
class RoomTypeFactory extends Factory
{
    private static array $types = [
        ['name' => 'Standard', 'capacity' => 2, 'base_price' => 350000, 'amenities' => ['WiFi', 'AC', 'TV']],
        ['name' => 'Deluxe', 'capacity' => 2, 'base_price' => 550000, 'amenities' => ['WiFi', 'AC', 'TV', 'Mini Bar', 'City View']],
        ['name' => 'Suite', 'capacity' => 3, 'base_price' => 950000, 'amenities' => ['WiFi', 'AC', 'TV', 'Bathtub', 'Mini Bar', 'Lounge Area']],
        ['name' => 'Family', 'capacity' => 4, 'base_price' => 750000, 'amenities' => ['WiFi', 'AC', '2x TV', 'Extra Beds']],
    ];

    private static int $index = 0;

    public function definition(): array
    {
        $type = self::$types[self::$index % count(self::$types)];
        self::$index++;

        return [
            'name' => $type['name'],
            'description' => fake()->sentence(),
            'base_price' => $type['base_price'],
            'capacity' => $type['capacity'],
            'amenities' => $type['amenities'],
        ];
    }
}
