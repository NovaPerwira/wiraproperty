import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
    room?: { room_number: string };
}

export default function Inquiries() {
    const { inquiries, stats, filters } = usePage<{
        inquiries: { data: Inquiry[]; current_page: number; last_page: number };
        stats: {
            total: number;
            new: number;
            replied: number;
            archived: number;
        };
        filters: { status: string; search: string };
    }>().props;

    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/cms/inquiries',
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    const updateStatus = (id: number, newStatus: string) => {
        router.patch(
            `/admin/cms/inquiries/${id}`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const deleteInquiry = (id: number) => {
        if (confirm('Are you sure you want to delete this inquiry?')) {
            router.delete(`/admin/cms/inquiries/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const STATUS_COLORS = {
        new: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        read: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        replied:
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        archived:
            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Inquiries', href: '/admin/cms/inquiries' },
            ]}
        >
            <Head title="Inquiries | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Inquiries Management</h1>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow-sm dark:bg-sidebar">
                        <p className="text-sm text-muted-foreground">
                            Total Inquiries
                        </p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/10">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            New
                        </p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {stats.new}
                        </p>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-900/10">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            Replied
                        </p>
                        <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                            {stats.replied}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Archived
                        </p>
                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                            {stats.archived}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border bg-white shadow-sm dark:bg-sidebar">
                    <div className="flex items-center justify-between gap-4 border-b border-sidebar-border p-4">
                        <form
                            onSubmit={handleFilter}
                            className="flex w-full max-w-md gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Search by name, email, or subject..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border px-3 py-1.5 text-sm dark:bg-black/20"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="rounded-lg border border-sidebar-border px-3 py-1.5 text-sm dark:bg-black/20"
                            >
                                <option value="">All Status</option>
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="archived">Archived</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
                            >
                                Filter
                            </button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Guest</th>
                                    <th className="px-6 py-3">Subject</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-muted-foreground"
                                        >
                                            No inquiries found.
                                        </td>
                                    </tr>
                                ) : (
                                    inquiries.data.map((inq) => (
                                        <tr
                                            key={inq.id}
                                            className="border-b border-sidebar-border last:border-0 hover:bg-muted/30"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(
                                                    inq.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">
                                                    {inq.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {inq.email}
                                                </div>
                                            </td>
                                            <td
                                                className="max-w-xs truncate px-6 py-4"
                                                title={inq.message}
                                            >
                                                <div className="font-medium">
                                                    {inq.subject ||
                                                        'No Subject'}
                                                </div>
                                                <div className="truncate text-xs text-muted-foreground">
                                                    {inq.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[inq.status] || ''}`}
                                                >
                                                    {inq.status}
                                                </span>
                                            </td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <select
                                                    value={inq.status}
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            inq.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="rounded border border-sidebar-border px-2 py-1 text-xs dark:bg-black/20"
                                                >
                                                    <option value="new">
                                                        New
                                                    </option>
                                                    <option value="read">
                                                        Read
                                                    </option>
                                                    <option value="replied">
                                                        Replied
                                                    </option>
                                                    <option value="archived">
                                                        Archived
                                                    </option>
                                                </select>
                                                <button
                                                    onClick={() =>
                                                        deleteInquiry(inq.id)
                                                    }
                                                    className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
