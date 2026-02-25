<?php

namespace Database\Factories;

use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'room_type_id' => RoomType::factory(),
            'room_number' => '',   // set in seeder with a specific pattern
            'floor' => 1,
            'status' => 'available',
            'notes' => null,
        ];
    }

    public function maintenance(): static
    {
        return $this->state(fn() => ['status' => 'maintenance']);
    }
}
