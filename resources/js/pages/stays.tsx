import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { BedDouble, Wifi, ArrowRight, CheckCircle2 } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';

interface RoomType {
    id: number;
    name: string;
    base_price: number;
    capacity: number;
    amenities: string[];
}

interface Props {
    roomTypes: RoomType[];
    settings?: Record<string, any>;
}

const ROOM_IMAGES = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
];

export default function Stays({ roomTypes }: Props) {
    const { settings } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUpVariant: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    };
    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };

    const formatRupiah = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

    // CMS-driven content
    const heroImage      = get('hero_image', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90');
    const heroLabel      = get('hero_label', 'Our Stays');
    const heroTitle      = get('hero_title', 'Exquisite Sanctuaries');
    const heroSubtitle   = get('hero_subtitle', 'Discover your perfect getaway. Every room is designed to blend modern luxury with breathtaking serenity.');
    const sectionTitle   = get('rooms_section_title', 'Our Accommodations');
    const sectionSub     = get('rooms_section_subtitle', 'Each space is designed to blend Balinese artistry with modern comfort.');
    const ctaLabel       = get('room_cta_label', 'Reserve');
    const perNight       = get('room_per_night', '/ night');
    const labelPopular   = get('label_popular', 'Popular');
    const labelCancel    = get('label_cancel', 'Free Cancellation');
    const labelGuests    = get('label_guests', 'Guests');

    return (
        <PublicLayout title="Our Stays">

            {/* ── HERO with parallax ── */}
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">

                {/* Parallax BG */}
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Stays hero" className="h-full w-full object-cover" />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/85" />

                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[130px]" />
                    <div className="absolute bottom-0 right-1/3 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[110px]" />
                    <div className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-300/10 blur-[90px]" />
                </div>

                {/* Text content */}
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.p variants={fadeUpVariant} className="mb-4 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">
                            {heroLabel}
                        </motion.p>
                        <motion.h1 variants={fadeUpVariant} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {heroTitle.split(' ')[0]}{' '}
                            <span className="italic text-white/75">
                                {heroTitle.split(' ').slice(1).join(' ') || 'Sanctuaries'}
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeUpVariant} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">
                            {heroSubtitle}
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Scroll hint */}
                <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
                    />
                </motion.div>
            </div>

            {/* ── ROOM CARDS ── */}
            <div className="bg-[#fafafa] py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    {/* Section header */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]">{sectionTitle}</h2>
                        {sectionSub && <p className="mx-auto max-w-xl text-base text-[#6b6b6b]">{sectionSub}</p>}
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="grid grid-cols-1 gap-8 md:grid-cols-2"
                    >
                        {roomTypes.map((room, idx) => (
                            <motion.div
                                key={room.id}
                                variants={fadeUpVariant}
                                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
                            >
                                <div className="relative h-[320px] overflow-hidden">
                                    <div className="absolute inset-0 z-10 bg-black/20 transition-opacity group-hover:opacity-0" />
                                    <img
                                        src={ROOM_IMAGES[idx % ROOM_IMAGES.length]}
                                        alt={room.name}
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {idx === 0 && (
                                        <div className="absolute top-6 left-6 z-20 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold tracking-wider text-[#1a1a1a] uppercase shadow-lg backdrop-blur-sm">
                                            {labelPopular}
                                        </div>
                                    )}
                                    {idx === 1 && (
                                        <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold tracking-wider text-[#1a1a1a] uppercase shadow-lg backdrop-blur-sm">
                                            <CheckCircle2 size={14} className="text-green-600" /> {labelCancel}
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <div className="mb-4 flex items-start justify-between">
                                        <h3 className="text-2xl font-semibold text-[#1a1a1a] transition-colors group-hover:text-black">{room.name}</h3>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#1a1a1a]">{formatRupiah(room.base_price)}</p>
                                            <p className="text-sm font-normal text-[#8c8c8c]">{perNight}</p>
                                        </div>
                                    </div>
                                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-[#6b6b6b]">
                                        <span className="flex items-center gap-1.5"><BedDouble size={16} /> Up to {room.capacity} {labelGuests}</span>
                                        {room.amenities && room.amenities.slice(0, 2).map((amenity, i) => (
                                            <span key={i} className="flex items-center gap-1.5"><Wifi size={16} /> {amenity}</span>
                                        ))}
                                    </div>
                                    <motion.a
                                        href="/checkout"
                                        whileTap={{ scale: 0.98 }}
                                        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#e0e0e0] bg-transparent px-8 py-4 text-sm font-medium text-[#1a1a1a] transition-all group-hover:border-[#121212] group-hover:bg-[#121212] group-hover:text-white"
                                    >
                                        {ctaLabel} {room.name}
                                        <ArrowRight size={16} className="-ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100" />
                                    </motion.a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
