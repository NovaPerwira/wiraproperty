import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';
import { PropertyCard, PropertyItem } from '@/components/PropertyCard';

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=80',
];

const DEMO_ITEMS: PropertyItem[] = [
    { id: 1, name: 'Villa Mewah Nusa Dua', location: 'Nusa Dua, Bali', price: 'Rp 15.000.000.000', beds: 5, baths: 5, size: '850m²', rating: 4.9, tag: 'Ultra Luxury' },
    { id: 2, name: 'Villa Tepi Danau Bedugul', location: 'Bedugul, Bali', price: 'Rp 9.500.000.000', beds: 4, baths: 4, size: '620m²', rating: 4.8, tag: 'Langka' },
    { id: 3, name: 'Villa Cliffside Uluwatu', location: 'Uluwatu, Bali', price: 'Rp 22.000.000.000', beds: 6, baths: 6, size: '1200m²', rating: 5.0, tag: 'Ikonik' },
    { id: 4, name: 'Villa Sawah Tabanan', location: 'Tabanan, Bali', price: 'Rp 6.800.000.000', beds: 3, baths: 3, size: '420m²', rating: 4.7, tag: 'Autentik' },
];

export default function PropertyVilla() {
    const { settings, properties } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const items: PropertyItem[] = properties?.length > 0 ? properties : DEMO_ITEMS;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage    = get('hero_image', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=90');
    const heroLabel    = get('hero_label', 'Property · Villa');
    const heroTitle    = get('hero_title', 'Villa Premium untuk Investasi');
    const heroSubtitle = get('hero_subtitle', 'Koleksi villa eksklusif untuk dijual — mulai dari villa butik hingga estate mewah dengan fasilitas world-class.');
    const sectionTitle = get('section_title', 'Daftar Villa Dijual');
    const sectionSub   = get('section_subtitle', 'Investasi terbaik dalam properti villa premium di lokasi-lokasi paling dicari.');

    return (
        <PublicLayout title="Property Villa">
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Property Villa" className="h-full w-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/80" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-rose-400/15 blur-[130px]" />
                    <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[110px]" />
                </div>
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-rose-300/80 uppercase">{heroLabel}</motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {heroTitle.split(' ').slice(0, 2).join(' ')}{' '}
                            <span className="italic text-white/75">{heroTitle.split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">{heroSubtitle}</motion.p>
                        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <a href="#listings" className="rounded-full bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-rose-500 hover:scale-105">Lihat Villa</a>
                            <a href="/about" className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10">Tentang Kami</a>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
                </motion.div>
            </div>

            <div id="listings" className="bg-[#fafafa] py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]">{sectionTitle}</h2>
                        <p className="mx-auto max-w-xl text-base text-[#6b6b6b]">{sectionSub}</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {items.map((item, idx) => (
                            <PropertyCard key={item.id} item={item} idx={idx} fallbackImages={FALLBACK_IMAGES} accentColor="rose" showType="villa" fadeUp={fadeUp} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
