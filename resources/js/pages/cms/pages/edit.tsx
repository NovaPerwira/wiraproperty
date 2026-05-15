import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PageEdit() {
    const { page, templates } = usePage<any>().props;
    const isEdit = !!page;

    const { data, setData, post, patch, processing, errors } = useForm({
        title: page?.title || '',
        slug: page?.slug || '',
        content: page?.content || '',
        template: page?.template || 'default',
        is_published: page?.is_published || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            patch(`/admin/cms/pages/${page.id}`);
        } else {
            post('/admin/cms/pages');
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'Pages', href: '/admin/cms/pages' },
                { title: isEdit ? 'Edit Page' : 'Create Page', href: '#' },
            ]}
        >
            <Head title={isEdit ? `Edit: ${page.title}` : 'Create Page'} />

            <form
                onSubmit={handleSubmit}
                className="flex max-w-5xl flex-col gap-6 p-6"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {isEdit ? 'Edit Page' : 'Create New Page'}
                    </h1>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Page'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content Area */}
                    <div className="flex flex-col gap-5 rounded-2xl border border-sidebar-border bg-white p-6 shadow-sm lg:col-span-2 dark:bg-sidebar">
                        <div>
                            <label className="mb-1 block text-sm font-semibold">
                                Page Title
                            </label>
                            <input
                                required
                                type="text"
                                value={data.title}
                                onChange={(e) => {
                                    setData('title', e.target.value);
                                    if (!isEdit && !data.slug) {
                                        setData(
                                            'slug',
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, '-')
                                                .replace(/(^-|-$)+/g, ''),
                                        );
                                    }
                                }}
                                className="w-full rounded-lg border border-sidebar-border bg-transparent p-3 text-lg font-medium"
                                placeholder="e.g. About Our Villa"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block flex justify-between text-sm font-semibold">
                                Content (Markdown/HTML)
                            </label>
                            <textarea
                                rows={20}
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                className="w-full rounded-lg border border-sidebar-border bg-transparent p-4 font-mono text-sm leading-relaxed"
                                placeholder="Write your content here..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="flex flex-col gap-5">
                        <div className="rounded-2xl border border-sidebar-border bg-white p-5 shadow-sm dark:bg-sidebar">
                            <h3 className="mb-4 border-b border-sidebar-border pb-2 font-bold">
                                Publishing
                            </h3>

                            <label className="mb-4 flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) =>
                                        setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <div>
                                    <div className="font-medium">Published</div>
                                    <div className="text-xs text-muted-foreground">
                                        Make this page visible to visitors
                                    </div>
                                </div>
                            </label>

                            <div className="mb-4">
                                <label className="mb-1 block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    URL Slug
                                </label>
                                <div className="flex overflow-hidden rounded-lg border border-sidebar-border bg-muted/30 focus-within:ring-2 focus-within:ring-indigo-500">
                                    <span className="border-r border-sidebar-border px-3 py-2 text-sm text-muted-foreground">
                                        /
                                    </span>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                        className="w-full border-0 bg-transparent p-2 text-sm focus:ring-0"
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    Template
                                </label>
                                <select
                                    value={data.template}
                                    onChange={(e) =>
                                        setData('template', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-sidebar-border bg-transparent p-2 text-sm"
                                >
                                    {templates.map((t: string) => (
                                        <option
                                            key={t}
                                            value={t}
                                            className="capitalize"
                                        >
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isEdit && (
                            <div className="rounded-2xl border border-sidebar-border bg-white p-5 text-sm shadow-sm dark:bg-sidebar">
                                <p className="mb-2 flex justify-between">
                                    <span className="text-muted-foreground">
                                        Status:
                                    </span>{' '}
                                    <b>
                                        {page.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </b>
                                </p>
                                <p className="mb-2 flex justify-between">
                                    <span className="text-muted-foreground">
                                        Last Edit:
                                    </span>{' '}
                                    <span>
                                        {new Date(
                                            page.updated_at,
                                        ).toLocaleString()}
                                    </span>
                                </p>
                                {page.published_at && (
                                    <p className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Published:
                                        </span>{' '}
                                        <span>
                                            {new Date(
                                                page.published_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
