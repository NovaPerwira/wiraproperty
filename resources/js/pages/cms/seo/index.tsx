import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function SeoSettings() {
    const { seoPages, siteSettings, pageKeys } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState('seo');
    const [activePageKey, setActivePageKey] = useState('home');

    // Forms
    const {
        data: seoData,
        setData: setSeoData,
        patch: patchSeo,
        processing: procSeo,
    } = useForm({
        title: '',
        description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
    });

    const {
        data: settsData,
        setData: setSettsData,
        patch: patchSetts,
        processing: procSetts,
    } = useForm({
        settings: [] as { key: string; value: string }[],
    });

    // Load active SEO
    useState(() => {
        if (seoPages[activePageKey]) {
            setSeoData({
                title: seoPages[activePageKey].title || '',
                description: seoPages[activePageKey].description || '',
                keywords: seoPages[activePageKey].keywords || '',
                og_title: seoPages[activePageKey].og_title || '',
                og_description: seoPages[activePageKey].og_description || '',
                og_image: seoPages[activePageKey].og_image || '',
            });
        }
    });

    const changeSeoPage = (key: string) => {
        setActivePageKey(key);
        const p = seoPages[key] || {};
        setSeoData({
            title: p.title || '',
            description: p.description || '',
            keywords: p.keywords || '',
            og_title: p.og_title || '',
            og_description: p.og_description || '',
            og_image: p.og_image || '',
        });
    };

    const submitSeo = (e: React.FormEvent) => {
        e.preventDefault();
        patchSeo(`/admin/cms/seo/${activePageKey}`);
    };

    // Load settings
    useState(() => {
        const flat: {key: string, value: string}[] = [];
        for (const group in siteSettings) {
            for (const key in siteSettings[group]) {
                flat.push({
                    key: siteSettings[group][key].key,
                    value: siteSettings[group][key].value || '',
                });
            }
        }
        
        const defaultKeys = ['contact_email', 'contact_phone', 'whatsapp_number', 'instagram_url'];
        defaultKeys.forEach(dk => {
            if (!flat.find(f => f.key === dk)) {
                flat.push({ key: dk, value: '' });
            }
        });
        
        setSettsData('settings', flat);
    });

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        patchSetts('/admin/cms/settings');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'CMS', href: '#' },
                { title: 'SEO & Settings', href: '/admin/cms/seo' },
            ]}
        >
            <Head title="SEO & Settings | CMS" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Site Configuration</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-sidebar-border">
                    <button
                        onClick={() => setActiveTab('seo')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'seo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        SEO Meta Tags
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Global Settings
                    </button>
                </div>

                {/* SEO Panel */}
                {activeTab === 'seo' && (
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex flex-col gap-1 md:w-1/4">
                            <h3 className="mb-2 px-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                Pages
                            </h3>
                            {pageKeys.map((k: string) => (
                                <button
                                    key={k}
                                    onClick={() => changeSeoPage(k)}
                                    className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium capitalize transition-colors ${activePageKey === k ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    {k}
                                </button>
                            ))}
                        </div>

                        <div className="md:w-3/4">
                            <form
                                onSubmit={submitSeo}
                                className="flex flex-col gap-5 rounded-2xl border border-sidebar-border bg-white p-6 shadow-sm dark:bg-sidebar"
                            >
                                <div className="flex items-center justify-between border-b border-sidebar-border pb-3">
                                    <h2 className="text-lg font-bold capitalize">
                                        {activePageKey} Page SEO
                                    </h2>
                                    <button
                                        type="submit"
                                        disabled={procSeo}
                                        className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
                                    >
                                        Save SEO
                                    </button>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        value={seoData.title}
                                        onChange={(e) =>
                                            setSeoData('title', e.target.value)
                                        }
                                        className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                        placeholder={`Best Villa in Bali | ${activePageKey.toUpperCase()}`}
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Recommended 50-60 characters.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold">
                                        Meta Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={seoData.description}
                                        onChange={(e) =>
                                            setSeoData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                    ></textarea>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Recommended 150-160 characters. Shows up
                                        in Google search results.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold">
                                        Keywords (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={seoData.keywords}
                                        onChange={(e) =>
                                            setSeoData(
                                                'keywords',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                        placeholder="villa bali, luxury stay, private pool"
                                    />
                                </div>

                                <div className="mt-2 border-t border-sidebar-border pt-4">
                                    <h3 className="mb-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        Social Media Share (Open Graph)
                                    </h3>
                                    <div className="mb-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold">
                                                OG Title
                                            </label>
                                            <input
                                                type="text"
                                                value={seoData.og_title}
                                                onChange={(e) =>
                                                    setSeoData(
                                                        'og_title',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold">
                                                OG Image URL
                                            </label>
                                            <input
                                                type="text"
                                                value={seoData.og_image}
                                                onChange={(e) =>
                                                    setSeoData(
                                                        'og_image',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold">
                                            OG Description
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={seoData.og_description}
                                            onChange={(e) =>
                                                setSeoData(
                                                    'og_description',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Global Settings Panel */}
                {activeTab === 'settings' && (
                    <form
                        onSubmit={submitSettings}
                        className="max-w-3xl rounded-2xl border border-sidebar-border bg-white p-6 shadow-sm dark:bg-sidebar"
                    >
                        <div className="mb-5 flex items-center justify-between border-b border-sidebar-border pb-3">
                            <h2 className="text-lg font-bold">
                                Contact & Social Links
                            </h2>
                            <button
                                type="submit"
                                disabled={procSetts}
                                className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
                            >
                                Save Settings
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {settsData.settings.map((s, idx) => (
                                <div key={idx}>
                                    <label className="mb-1 block text-sm font-semibold capitalize">
                                        {s.key.replace('_', ' ')}
                                    </label>
                                    <input
                                        type="text"
                                        value={s.value}
                                        onChange={(e) => {
                                            const newS = [
                                                ...settsData.settings,
                                            ];
                                            newS[idx].value = e.target.value;
                                            setSettsData('settings', newS);
                                        }}
                                        className="w-full rounded border border-sidebar-border bg-transparent p-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
