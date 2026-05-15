import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Facilities() {
    const { facilities, categories } = usePage<any>().props;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        icon: '',
        description: '',
        category: 'general',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cms/facilities', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteItem = (id: number) => {
        if (confirm('Delete this facility?')) {
            router.delete(`/admin/cms/facilities/${id}`);
        }
    };

    const toggleStatus = (id: number, currentValue: boolean) => {
        router.patch(
            `/admin/cms/facilities/${id}`,
            { is_active: !currentValue },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Facilities', href: '/admin/cms/facilities' },
            ]}
        >
            <Head title="Facilities | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Facilities</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        + Add Facility
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border bg-white shadow-sm dark:bg-sidebar">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-sidebar-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                            <tr>
                                <th className="px-6 py-3">Facility</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {facilities.map((f: any) => (
                                <tr
                                    key={f.id}
                                    className="border-b border-sidebar-border last:border-0 hover:bg-muted/30"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="rounded bg-muted p-1.5 text-2xl">
                                                {f.icon || '✨'}
                                            </span>
                                            <div>
                                                <div className="text-base font-medium">
                                                    {f.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {f.description ||
                                                        'No description'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">
                                        {f.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() =>
                                                toggleStatus(f.id, f.is_active)
                                            }
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${f.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}
                                        >
                                            {f.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteItem(f.id)}
                                            className="text-sm font-medium text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {facilities.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No facilities found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-sidebar">
                        <div className="flex items-center justify-between border-b border-sidebar-border p-5">
                            <h2 className="text-lg font-bold">Add Facility</h2>
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
                            <div>
                                <label className="mb-1 block text-xs font-medium">
                                    Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Icon (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={2}
                                        value={data.icon}
                                        onChange={(e) =>
                                            setData('icon', e.target.value)
                                        }
                                        className="w-full rounded border p-2 text-sm"
                                        placeholder="🏊‍♂️"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium">
                                        Category
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        className="w-full rounded border p-2 text-sm"
                                    >
                                        {categories.map((c: string) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                ></textarea>
                            </div>

                            <label className="mt-2 flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                />
                                Active (Show on site)
                            </label>

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
