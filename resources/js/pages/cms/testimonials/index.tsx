import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Testimonials() {
    const { testimonials, stats, filters, platforms, rooms } =
        usePage<any>().props;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        guest_name: '',
        guest_location: '',
        content: '',
        rating: 5,
        platform: 'direct',
        platform_url: '',
        is_featured: false,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cms/testimonials', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteItem = (id: number) => {
        if (confirm('Delete this testimonial?')) {
            router.delete(`/admin/cms/testimonials/${id}`);
        }
    };

    const toggleStatus = (
        id: number,
        field: 'is_active' | 'is_featured',
        currentValue: boolean,
    ) => {
        router.patch(
            `/admin/cms/testimonials/${id}`,
            { [field]: !currentValue },
            { preserveScroll: true },
        );
    };

    const filterPlatform = (p: string) => {
        router.get(
            '/admin/cms/testimonials',
            { platform: p === 'all' ? '' : p },
            { preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Testimonials', href: '/admin/cms/testimonials' },
            ]}
        >
            <Head title="Testimonials | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Testimonials</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        + Add Review
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-sidebar-border bg-white p-4 shadow-sm dark:bg-sidebar">
                        <p className="text-sm text-muted-foreground">
                            Total Reviews
                        </p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10">
                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                            Average Rating
                        </p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                            ⭐ {stats.avg}
                        </p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/10">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            Featured
                        </p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {stats.featured}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 border-b border-sidebar-border pb-2">
                    <button
                        onClick={() => filterPlatform('all')}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium ${!filters?.platform ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-muted text-muted-foreground'}`}
                    >
                        All
                    </button>
                    {platforms.map((p: string) => (
                        <button
                            key={p}
                            onClick={() => filterPlatform(p)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filters?.platform === p ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-muted text-muted-foreground'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {testimonials.data.map((t: any) => (
                        <div
                            key={t.id}
                            className="flex flex-col justify-between rounded-xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar"
                        >
                            <div>
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold">
                                            {t.guest_name}
                                        </h3>
                                        {t.guest_location && (
                                            <p className="text-xs text-muted-foreground">
                                                {t.guest_location}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-sm text-amber-400">
                                        {'★'.repeat(t.rating)}
                                        {'☆'.repeat(5 - t.rating)}
                                    </span>
                                </div>
                                <p className="mb-4 line-clamp-4 text-sm text-muted-foreground italic">
                                    "{t.content}"
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-sidebar-border pt-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            toggleStatus(
                                                t.id,
                                                'is_active',
                                                t.is_active,
                                            )
                                        }
                                        className={`rounded px-2 py-1 text-xs font-medium ${t.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                        {t.is_active ? 'Visible' : 'Hidden'}
                                    </button>
                                    <button
                                        onClick={() =>
                                            toggleStatus(
                                                t.id,
                                                'is_featured',
                                                t.is_featured,
                                            )
                                        }
                                        className={`rounded px-2 py-1 text-xs font-medium ${t.is_featured ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'}`}
                                    >
                                        {t.is_featured
                                            ? 'Featured'
                                            : 'Not Featured'}
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground capitalize">
                                        {t.platform}
                                    </span>
                                    <button
                                        onClick={() => deleteItem(t.id)}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-sidebar">
                        <div className="flex items-center justify-between border-b border-sidebar-border p-5">
                            <h2 className="text-lg font-bold">
                                Add Testimonial
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                &times;
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 p-5"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Guest Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={data.guest_name}
                                        onChange={(e) =>
                                            setData(
                                                'guest_name',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border p-2 text-sm"
                                    />
                                    {errors.guest_name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.guest_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Location (Opt)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.guest_location}
                                        onChange={(e) =>
                                            setData(
                                                'guest_location',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border p-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium">
                                    Review Content
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Rating (1-5)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={data.rating}
                                        onChange={(e) =>
                                            setData(
                                                'rating',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="w-full rounded border p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Platform
                                    </label>
                                    <select
                                        value={data.platform}
                                        onChange={(e) =>
                                            setData('platform', e.target.value)
                                        }
                                        className="w-full rounded border p-2 text-sm"
                                    >
                                        {platforms.map((p: string) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-2 flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    Visible on site
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                'is_featured',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    Feature on Homepage
                                </label>
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded border px-4 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
