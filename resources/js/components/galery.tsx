import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Grid as GridIcon } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const defaultGalleryItems = [
    {
        id: 1,
        title: 'Earth Sentinels',
        src: '/img/villa.png', // Ganti dengan gambar besar kiri
        link: '#',
        // Class khusus agar item pertama melebar 2 kolom dan 2 baris
        gridClass: 'lg:col-span-2 lg:row-span-2',
    },
    {
        id: 2,
        title: 'Light Portal',
        src: '/img/rumah.png',
        link: '#',
        gridClass: '',
    },
    {
        id: 3,
        title: 'Night Sculpture',
        src: '/img/ruko.png',
        link: '#',
        gridClass: '',
    },
    {
        id: 4,
        title: 'The Dome',
        src: '/img/tanah.png',
        link: '#',
        gridClass: '',
    },
    {
        id: 5,
        title: 'Bamboo Structure',
        src: '/img/villa.png',
        link: '#',
        gridClass: '', // Item terakhir akan memiliki tombol "See all"
    },
];

const GallerySection = ({ items }: { items?: any[] }) => {
    // Attempt to get items from Inertia props if available
    let inertiaItems;
    try {
        const props = usePage<any>().props;
        inertiaItems = props.galleryItems;
    } catch (e) {
        // Not inside Inertia context
    }

    const galleryItems = items && items.length > 0 ? items : (inertiaItems && inertiaItems.length > 0 ? inertiaItems : defaultGalleryItems);
    // Variasi animasi stagger untuk container
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    // Variasi animasi fade in untuk setiap item
    const itemVariant: any = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <div className="relative z-10 flex w-full justify-center bg-white py-24">
            <div className="mx-auto w-full max-w-[1440px] px-8 lg:px-16">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    // Setup CSS Grid:
                    // Di mobile: 1 kolom.
                    // Di Laptop (lg): 4 kolom, 2 baris.
                    // Set tinggi fix di laptop agar bentuknya terjaga (lg:h-[640px]).
                    className="grid min-h-[800px] grid-cols-1 gap-4 md:grid-cols-2 lg:min-h-[640px] lg:grid-cols-4 lg:grid-rows-2 lg:gap-6"
                >
                    {galleryItems.map((item, index) => {
                        const isLastItem = index === galleryItems.length - 1;

                        return (
                            <motion.a
                                key={item.id}
                                variants={itemVariant}
                                href={item.link} // Direct link untuk setiap foto
                                // Gunakan class 'group' untuk trigger hover effect
                                className={`group relative block overflow-hidden rounded-[32px] ${item.gridClass} h-64 md:h-full`}
                            >
                                {/* Gambar Latar */}
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />

                                {/* Overlay Gelap saat Hover */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                {/* Label Judul di Tengah (Muncul saat hover) */}
                                {/* Kita sembunyikan label hover ini KHUSUS untuk item terakhir, karena dia punya tombol statis */}
                                {!isLastItem && (
                                    <div className="absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                                        <div className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-[#1a2320] shadow-sm backdrop-blur-md md:text-base">
                                            <Sun
                                                size={18}
                                                className="text-[#1a2320]"
                                            />{' '}
                                            {/* Icon Hiasan */}
                                            {item.title}
                                        </div>
                                    </div>
                                )}

                                {/* Tombol "See all photos" (Hanya di item terakhir, selalu terlihat) */}
                                {isLastItem && (
                                    <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6">
                                        <div className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#1a2320] shadow-md transition-colors hover:bg-[#f0f0f0]">
                                            See all {galleryItems.length} photos
                                            <GridIcon size={16} />
                                        </div>
                                    </div>
                                )}
                            </motion.a>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default GallerySection;
