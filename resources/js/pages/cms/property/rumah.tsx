import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React from 'react';

export default function PropertyRumahCms() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const { data, setData, patch, processing } = useForm({
        hero_title:       get('hero_title', 'Rumah Impian Anda'),
        hero_subtitle:    get('hero_subtitle', 'Koleksi rumah pilihan terbaik di lokasi premium. Dari rumah mewah modern hingga villa tropis yang asri.'),
        hero_image:       get('hero_image', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2400&q=90'),
        hero_label:       get('hero_label', 'Property · Rumah'),
        section_title:    get('section_title', 'Daftar Rumah Dijual'),
        section_subtitle: get('section_subtitle', 'Temukan rumah sempurna sesuai kebutuhan dan anggaran Anda.'),
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); patch('/admin/cms/property/rumah'); };
    const inputCls = 'w-full border border-sidebar-border rounded p-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40';

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div><label className="block text-sm font-semibold mb-1">{label}</label>{children}</div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Property', href: '#' }, { title: 'Rumah', href: '/admin/cms/property/rumah' }]}>
            <Head title="Property Rumah CMS" />
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Property Rumah Page</h1>
                        <p className="text-sm text-muted-foreground mt-1">Edit konten untuk halaman <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/property/rumah</code></p>
                    </div>
                    <button onClick={submit} disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-60">
                        <Save size={18} /> Simpan
                    </button>
                </div>
                <div className="flex flex-col gap-6">
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏠 Hero Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Page Label"><input type="text" className={inputCls} value={data.hero_label} onChange={e => setData('hero_label', e.target.value)} /></Field>
                            <Field label="Hero Title"><input type="text" className={inputCls} value={data.hero_title} onChange={e => setData('hero_title', e.target.value)} /></Field>
                            <div className="col-span-2">
                                <Field label="Hero Subtitle"><textarea rows={2} className={inputCls} value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} /></Field>
                            </div>
                            <div className="col-span-2">
                                <Field label="Hero Image URL">
                                    <input type="text" className={inputCls} value={data.hero_image} onChange={e => setData('hero_image', e.target.value)} />
                                    {data.hero_image && (
                                        <div className="mt-2 relative overflow-hidden rounded-xl border border-sidebar-border" style={{ height: 200 }}>
                                            <img src={data.hero_image} alt="preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
                                                <p className="text-xs tracking-[0.3em] uppercase text-blue-300/80 mb-1">{data.hero_label}</p>
                                                <p className="text-xl font-semibold">{data.hero_title}</p>
                                            </div>
                                        </div>
                                    )}
                                </Field>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">📋 Listings Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Section Title"><input type="text" className={inputCls} value={data.section_title} onChange={e => setData('section_title', e.target.value)} /></Field>
                            <div className="col-span-2">
                                <Field label="Section Subtitle"><textarea rows={2} className={inputCls} value={data.section_subtitle} onChange={e => setData('section_subtitle', e.target.value)} /></Field>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
