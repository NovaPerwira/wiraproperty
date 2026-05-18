import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React from 'react';

export default function VillaLombokCms() {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const { data, setData, patch, processing } = useForm({
        hero_title:       get('hero_title', 'Keindahan Tersembunyi Pulau Seribu Masjid'),
        hero_subtitle:    get('hero_subtitle', 'Lombok menawarkan pesona alam yang masih alami dengan pantai berpasir putih dan gunung yang megah.'),
        hero_image:       get('hero_image', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2400&q=90'),
        hero_label:       get('hero_label', 'Villa Lombok'),
        section_title:    get('section_title', 'Koleksi Villa Lombok Kami'),
        section_subtitle: get('section_subtitle', 'Villa pilihan terbaik di destinasi eksotis Lombok dengan pemandangan spektakuler.'),
    });

    const submit = (e: React.FormEvent) => { e.preventDefault(); patch('/admin/cms/villa/lombok'); };
    const inputCls = 'w-full border border-sidebar-border rounded p-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40';

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div><label className="block text-sm font-semibold mb-1">{label}</label>{children}</div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Villa', href: '#' }, { title: 'Villa Lombok', href: '/admin/cms/villa/lombok' }]}>
            <Head title="Villa Lombok CMS" />
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Villa Lombok Page</h1>
                        <p className="text-sm text-muted-foreground mt-1">Edit konten untuk halaman <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/villa/lombok</code></p>
                    </div>
                    <button onClick={submit} disabled={processing} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-60">
                        <Save size={18} /> Simpan
                    </button>
                </div>
                <div className="flex flex-col gap-6">
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏔️ Hero Section</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Page Label"><input type="text" className={inputCls} value={data.hero_label} onChange={e => setData('hero_label', e.target.value)} /></Field>
                            <Field label="Hero Title"><input type="text" className={inputCls} value={data.hero_title} onChange={e => setData('hero_title', e.target.value)} /></Field>
                            <div className="col-span-2">
                                <Field label="Hero Subtitle"><textarea rows={2} className={inputCls} value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} /></Field>
                            </div>
                            <div className="col-span-2">
                                <Field label="Hero Background Image URL">
                                    <input type="text" className={inputCls} value={data.hero_image} onChange={e => setData('hero_image', e.target.value)} />
                                    {data.hero_image && (
                                        <div className="mt-2 relative overflow-hidden rounded-xl border border-sidebar-border" style={{ height: 200 }}>
                                            <img src={data.hero_image} alt="preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/85 flex flex-col items-center justify-center text-white text-center px-4">
                                                <p className="text-xs tracking-[0.3em] uppercase text-teal-300/80 mb-1">{data.hero_label}</p>
                                                <p className="text-xl font-semibold">{data.hero_title}</p>
                                                <p className="text-xs text-white/55 mt-1 line-clamp-2 max-w-xs">{data.hero_subtitle}</p>
                                            </div>
                                        </div>
                                    )}
                                </Field>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 border-b border-sidebar-border pb-2">🏠 Listings Section</h2>
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
