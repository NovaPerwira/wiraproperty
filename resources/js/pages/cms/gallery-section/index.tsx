import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, Image as ImageIcon } from 'lucide-react';
import React, { useRef } from 'react';

export default function GallerySectionCms() {
    const { galleryItems } = usePage<any>().props;

    const { data, setData, post, processing } = useForm({
        items: galleryItems,
        images: [] as (File | null)[],
    });

    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cms/gallery-section');
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const handleImageChange = (index: number, file: File | null) => {
        const newImages = [...data.images];
        newImages[index] = file;
        setData('images', newImages);

        if (file) {
            const url = URL.createObjectURL(file);
            updateItem(index, 'src', url);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'CMS', href: '#' }, { title: 'Gallery Section', href: '/admin/cms/gallery-section' }]}>
            <Head title="Gallery Section CMS" />

            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gallery Section Content</h1>
                    <button
                        onClick={submit}
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>

                <div className="bg-white dark:bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-6">
                        Manage the 5 images displayed in the Gallery Section on the homepage. 
                        The first image automatically spans 2 rows and 2 columns on desktop.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.items.map((item: any, i: number) => (
                            <div key={item.id} className={`border border-sidebar-border rounded-lg p-4 flex flex-col gap-4 bg-gray-50 dark:bg-black/20 ${i === 0 ? 'md:col-span-2' : ''}`}>
                                <div className="flex gap-4">
                                    <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative border border-sidebar-border group">
                                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                onClick={() => fileInputRefs.current[i]?.click()}
                                                className="text-white flex flex-col items-center gap-1"
                                            >
                                                <ImageIcon size={20} />
                                                <span className="text-xs">Change</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow flex flex-col gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold mb-1 text-muted-foreground">Title {i === 0 ? '(Large Image)' : ''}</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-sidebar-border rounded p-2 text-sm bg-white dark:bg-sidebar" 
                                                value={item.title} 
                                                onChange={e => updateItem(i, 'title', e.target.value)} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold mb-1 text-muted-foreground">Link</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-sidebar-border rounded p-2 text-sm bg-white dark:bg-sidebar" 
                                                value={item.link} 
                                                onChange={e => updateItem(i, 'link', e.target.value)} 
                                            />
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            ref={el => fileInputRefs.current[i] = el}
                                            onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    handleImageChange(i, e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
