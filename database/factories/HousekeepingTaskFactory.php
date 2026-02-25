<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HousekeepingTask>
 */
class HousekeepingTaskFactory extends Factory
{
    private static array $types = ['cleaning', 'inspection', 'maintenance', 'turndown'];
    private static array $statuses = ['pending', 'in_progress', 'done', 'skipped'];

    public function definition(): array
    {
        $status = fake()->randomElement(self::$statuses);

        return [
            'room_id' => Room::inRandomOrder()->value('id'),
            'assigned_to' => fake()->optional(0.7)->passthrough(User::inRandomOrder()->value('id')),
            'booking_id' => null,
            'task_type' => fake()->randomElement(self::$types),
            'status' => $status,
            'priority' => fake()->randomElement(['normal', 'normal', 'normal', 'urgent']),
            'notes' => fake()->optional(0.3)->sentence(),
            'scheduled_for' => fake()->dateTimeBetween('-3 days', '+2 days')->format('Y-m-d'),
            'completed_at' => $status === 'done' ? fake()->dateTimeBetween('-3 days', 'now') : null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn() => [
            'status' => 'pending',
            'completed_at' => null,
            'scheduled_for' => now()->toDateString(),
        ]);
    }
}
