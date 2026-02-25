<?php

namespace App\Http\Controllers;

use App\Models\HousekeepingTask;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HousekeepingController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', now()->toDateString());

        // All tasks for the given date, with room and assigned staff info
        $tasks = HousekeepingTask::with('room.roomType', 'assignedTo:id,name', 'booking:id,guest_name,check_out_date')
            ->whereDate('scheduled_for', $date)
            ->orderBy('priority', 'desc') // urgent first
            ->orderBy('room_id')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'room_id' => $t->room_id,
                'room_number' => $t->room?->room_number,
                'floor' => $t->room?->floor,
                'room_type' => $t->room?->roomType?->name,
                'room_status' => $t->room?->status,
                'task_type' => $t->task_type,
                'status' => $t->status,
                'status_color' => $t->status_color,
                'priority' => $t->priority,
                'notes' => $t->notes,
                'assigned_to' => $t->assigned_to,
                'assigned_name' => $t->assignedTo?->name,
                'guest_name' => $t->booking?->guest_name,
                'completed_at' => $t->completed_at?->format('H:i'),
                'scheduled_for' => $t->scheduled_for?->format('Y-m-d'),
            ]);

        // Board summary counts
        $summary = [
            'needs_cleaning' => $tasks->whereIn('task_type', ['cleaning', 'turndown'])->whereIn('status', ['pending', 'in_progress'])->count(),
            'ready' => $tasks->where('status', 'done')->count(),
            'maintenance' => $tasks->where('task_type', 'maintenance')->whereIn('status', ['pending', 'in_progress'])->count(),
            'skipped' => $tasks->where('status', 'skipped')->count(),
        ];

        // Available staff for assignment
        $staff = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('housekeeping/index', [
            'tasks' => $tasks,
            'summary' => $summary,
            'staff' => $staff,
            'date' => $date,
        ]);
    }

    public function update(Request $request, HousekeepingTask $housekeepingTask): RedirectResponse
    {
        $data = $request->validate([
            'status' => 'sometimes|in:pending,in_progress,done,skipped',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'sometimes|in:normal,urgent',
            'notes' => 'nullable|string',
        ]);

        if (isset($data['status']) && $data['status'] === 'done' && !$housekeepingTask->completed_at) {
            $data['completed_at'] = now();
        }

        $housekeepingTask->update($data);

        return back()->with('success', 'Status kamar diperbarui.');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'task_type' => 'required|in:cleaning,inspection,maintenance,turndown',
            'priority' => 'required|in:normal,urgent',
            'notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'scheduled_for' => 'required|date',
        ]);

        HousekeepingTask::create($data);

        return back()->with('success', 'Tugas kebersihan dibuat.');
    }
}
