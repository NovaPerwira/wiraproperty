import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from 'react-i18next';

interface Task {
    id: number;
    room_id: number;
    room_number: string | null;
    floor: number | null;
    room_type: string | null;
    room_status: string;
    task_type: 'cleaning' | 'inspection' | 'maintenance' | 'turndown';
    status: 'pending' | 'in_progress' | 'done' | 'skipped';
    status_color: string;
    priority: 'normal' | 'urgent';
    notes: string | null;
    assigned_to: number | null;
    assigned_name: string | null;
    guest_name: string | null;
    completed_at: string | null;
    scheduled_for: string;
}

interface Summary {
    needs_cleaning: number;
    ready: number;
    maintenance: number;
    skipped: number;
}

interface Staff {
    id: number;
    name: string;
}

interface PageProps {
    [key: string]: unknown;
    tasks: {
        data: Task[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    summary: Summary;
    staff: Staff[];
    date: string;
    flash?: { success?: string };
}

const TASK_ICONS: Record<string, string> = {
    cleaning: '🧹',
    inspection: '🔍',
    maintenance: '🔧',
    turndown: '🛏️',
};

const STATUS_CONFIG: Record<
    string,
    { bg: string; text: string; label: string; icon: string }
> = {
    pending: {
        bg: 'bg-amber-900/30 border-amber-700/40',
        text: 'text-amber-300',
        label: 'Perlu Dibersihkan',
        icon: '🟡',
    },
    in_progress: {
        bg: 'bg-blue-900/30 border-blue-700/40',
        text: 'text-blue-300',
        label: 'Sedang Dikerjakan',
        icon: '🔵',
    },
    done: {
        bg: 'bg-emerald-900/30 border-emerald-700/40',
        text: 'text-emerald-300',
        label: 'Siap / Bersih',
        icon: '🟢',
    },
    skipped: {
        bg: 'bg-neutral-800/30 border-neutral-700/40',
        text: 'text-neutral-400',
        label: 'Dilewati',
        icon: '⚪',
    },
};

function TaskCard({
    task,
    staff,
    onUpdate,
}: {
    task: Task;
    staff: Staff[];
    onUpdate: (
        id: number,
        data: Record<string, string | number | null>,
    ) => void;
}) {
    const isUrgent = task.priority === 'urgent';
    const isMaintenance = task.task_type === 'maintenance';

    return (
        <div
            className={`rounded-xl border p-3 ${isMaintenance ? 'border-rose-700/50 bg-rose-950/20' : STATUS_CONFIG[task.status].bg} transition-all`}
        >
            {/* Header */}
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">
                        {TASK_ICONS[task.task_type]}
                    </span>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                                Kamar {task.room_number ?? '?'}
                            </span>
                            {isUrgent && (
                                <span className="rounded-full bg-rose-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                    URGENT
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-neutral-500">
                            {task.room_type} · Lantai {task.floor}
                        </div>
                    </div>
                </div>
                <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CONFIG[task.status].text} bg-neutral-900/50`}
                >
                    {STATUS_CONFIG[task.status].icon}{' '}
                    {task.status.replace('_', ' ')}
                </span>
            </div>

            {/* Guest info */}
            {task.guest_name && (
                <div className="mb-2 rounded-lg bg-neutral-900/40 px-2 py-1 text-xs text-neutral-400">
                    👤 Post-checkout:{' '}
                    <span className="text-white">{task.guest_name}</span>
                </div>
            )}

            {/* Notes */}
            {task.notes && (
                <p className="mb-2 text-xs text-neutral-400 italic">
                    {task.notes}
                </p>
            )}

            {/* Staff */}
            <div className="mb-3 flex items-center gap-2">
                <span className="text-xs text-neutral-500">Ditugaskan:</span>
                <select
                    defaultValue={task.assigned_to ?? ''}
                    onChange={(e) =>
                        onUpdate(task.id, {
                            assigned_to: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                        })
                    }
                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                    <option value="">— Belum Ditugaskan —</option>
                    {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            {task.status !== 'done' && task.status !== 'skipped' && (
                <div className="flex gap-2">
                    {task.status === 'pending' && (
                        <button
                            onClick={() =>
                                onUpdate(task.id, { status: 'in_progress' })
                            }
                            className="flex-1 rounded-lg bg-blue-700 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
                        >
                            ▶ Mulai
                        </button>
                    )}
                    <button
                        onClick={() => onUpdate(task.id, { status: 'done' })}
                        className="flex-1 rounded-lg bg-emerald-700 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                    >
                        ✓ Selesai
                    </button>
                    <button
                        onClick={() => onUpdate(task.id, { status: 'skipped' })}
                        className="rounded-lg border border-neutral-700 px-2 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-neutral-700"
                    >
                        Skip
                    </button>
                </div>
            )}
            {task.status === 'done' && (
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                    ✓ Selesai
                    {task.completed_at ? ` pukul ${task.completed_at}` : ''}
                </div>
            )}
        </div>
    );
}

export default function HousekeepingIndex() {
    const { t } = useTranslation();
    const { tasks, summary, staff, date, flash } = usePage<PageProps>().props;
    const [selectedDate, setSelectedDate] = useState(date);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTask, setNewTask] = useState({
        room_id: '',
        task_type: 'cleaning',
        priority: 'normal',
        notes: '',
        assigned_to: '',
        scheduled_for: date,
    });

    const updateTask = (
        id: number,
        data: Record<string, string | number | null>,
    ) => {
        router.patch(`/admin/housekeeping/${id}`, data, {
            preserveState: false,
        });
    };

    const changeDate = (d: string) => {
        setSelectedDate(d);
        router.get(
            '/admin/housekeeping',
            { date: d },
            { preserveState: true, replace: true },
        );
    };

    const submitNewTask = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/housekeeping',
            newTask as unknown as Record<string, string>,
            {
                onSuccess: () => {
                    setShowAddModal(false);
                },
            },
        );
    };

    const columns: Array<{
        key: string;
        label: string;
        filter: (t: Task) => boolean;
        headerColor: string;
    }> = [
        {
            key: 'needs_cleaning',
            label: `🟡 Perlu Dibersihkan (${summary.needs_cleaning})`,
            filter: (t) =>
                ['pending', 'in_progress'].includes(t.status) &&
                ['cleaning', 'turndown', 'inspection'].includes(t.task_type),
            headerColor: 'border-amber-700/50 bg-amber-900/20',
        },
        {
            key: 'ready',
            label: `🟢 Kamar Siap (${summary.ready})`,
            filter: (t) => t.status === 'done',
            headerColor: 'border-emerald-700/50 bg-emerald-900/20',
        },
        {
            key: 'maintenance',
            label: `🔴 Maintenance (${summary.maintenance})`,
            filter: (t) =>
                t.task_type === 'maintenance' &&
                ['pending', 'in_progress'].includes(t.status),
            headerColor: 'border-rose-700/50 bg-rose-900/20',
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Housekeeping', href: '/admin/housekeeping' },
            ]}
        >
            <Head title="Housekeeping Status" />

            <div className="space-y-6 p-6">
                {flash?.success && (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {t('housekeeping.title')}
                        </h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            Status kebersihan dan maintenance kamar
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => changeDate(e.target.value)}
                            className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
                        >
                            🔧 Buat Alert Maintenance
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        {
                            label: 'Perlu Dibersihkan',
                            value: summary.needs_cleaning,
                            color: 'text-amber-400',
                        },
                        {
                            label: 'Kamar Siap',
                            value: summary.ready,
                            color: 'text-emerald-400',
                        },
                        {
                            label: 'Maintenance',
                            value: summary.maintenance,
                            color: 'text-rose-400',
                        },
                        {
                            label: 'Dilewati',
                            value: summary.skipped,
                            color: 'text-neutral-400',
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-center"
                        >
                            <div className={`text-2xl font-bold ${s.color}`}>
                                {s.value}
                            </div>
                            <div className="mt-0.5 text-xs text-neutral-500">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Task Modal */}
                {showAddModal && (
                    <div className="rounded-2xl border border-rose-700/40 bg-rose-950/20 p-5">
                        <h2 className="mb-4 font-semibold text-white">
                            🔧 Buat Tugas Baru
                        </h2>
                        <form
                            onSubmit={submitNewTask}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            <div>
                                <label className="mb-1 block text-xs text-neutral-400">
                                    Kamar (ID)
                                </label>
                                <input
                                    type="number"
                                    value={newTask.room_id}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            room_id: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                                    placeholder="Room ID"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-neutral-400">
                                    Jenis Tugas
                                </label>
                                <select
                                    value={newTask.task_type}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            task_type: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                                >
                                    {[
                                        ['cleaning', '🧹 Cleaning'],
                                        ['inspection', '🔍 Inspection'],
                                        ['maintenance', '🔧 Maintenance'],
                                        ['turndown', '🛏️ Turndown'],
                                    ].map(([v, l]) => (
                                        <option key={v} value={v}>
                                            {l}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-neutral-400">
                                    Prioritas
                                </label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            priority: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="urgent">🚨 Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-neutral-400">
                                    Jadwal
                                </label>
                                <input
                                    type="date"
                                    value={newTask.scheduled_for}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            scheduled_for: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-neutral-400">
                                    Tugaskan ke
                                </label>
                                <select
                                    value={newTask.assigned_to}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            assigned_to: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                                >
                                    <option value="">— Pilih Staff —</option>
                                    {staff.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-neutral-400">
                                    Catatan
                                </label>
                                <input
                                    type="text"
                                    value={newTask.notes}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Detail masalah..."
                                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 sm:col-span-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-rose-600 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
                                >
                                    Buat Tugas
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Kanban Board */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {columns.map((col) => {
                        const colTasks = tasks.data.filter(col.filter);
                        return (
                            <div
                                key={col.key}
                                className={`rounded-2xl border ${col.headerColor} overflow-hidden`}
                            >
                                <div
                                    className={`border-b ${col.headerColor} px-4 py-2.5`}
                                >
                                    <h2 className="text-sm font-semibold text-white">
                                        {col.label}
                                    </h2>
                                </div>
                                <div className="min-h-[200px] space-y-3 p-3">
                                    {colTasks.length === 0 && (
                                        <div className="flex h-24 items-center justify-center text-sm text-neutral-600">
                                            Tidak ada tugas
                                        </div>
                                    )}
                                    {colTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            staff={staff}
                                            onUpdate={updateTask}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {tasks.links && tasks.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-1 pb-4">
                        {tasks.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg border px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'border-rose-600 bg-rose-600 text-white'
                                        : link.url
                                          ? 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                          : 'cursor-not-allowed border-neutral-800 bg-neutral-900 text-neutral-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
