import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function PagesIndex() {
    const { pages } = usePage<any>().props;

    const deletePage = (id: number) => {
        if (confirm('Are you sure you want to delete this page?')) {
            router.delete(`/admin/cms/pages/${id}`);
        }
    };

    const togglePublish = (id: number, currentStatus: boolean) => {
        router.patch(`/admin/cms/pages/${id}`, {
            is_published: !currentStatus,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Dynamic Pages', href: '/admin/cms/pages' },
            ]}
        >
            <Head title="Pages | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dynamic Pages</h1>
                    <Link
                        href="/admin/cms/pages/create"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        + Create Page
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border bg-white shadow-sm dark:bg-sidebar">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-sidebar-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                            <tr>
                                <th className="px-6 py-3">Page Title & Slug</th>
                                <th className="px-6 py-3">Template</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Last Updated</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((p: any) => (
                                <tr
                                    key={p.id}
                                    className="border-b border-sidebar-border last:border-0 hover:bg-muted/30"
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-base font-bold">
                                            {p.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            /{p.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className="rounded bg-muted px-2 py-1 text-xs">
                                            {p.template}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() =>
                                                togglePublish(
                                                    p.id,
                                                    p.is_published,
                                                )
                                            }
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}
                                        >
                                            {p.is_published
                                                ? 'Published'
                                                : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(
                                                p.updated_at,
                                            ).toLocaleDateString()}
                                        </div>
                                        {p.editor && (
                                            <div className="mt-0.5 text-[10px] text-muted-foreground">
                                                by {p.editor.name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="flex justify-end gap-3 px-6 py-4 text-right">
                                        <a
                                            href={`/${p.slug}`}
                                            target="_blank"
                                            className="font-medium text-blue-500 hover:text-blue-700"
                                        >
                                            View
                                        </a>
                                        <Link
                                            href={`/admin/cms/pages/${p.id}/edit`}
                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deletePage(p.id)}
                                            className="font-medium text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pages.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No pages created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
