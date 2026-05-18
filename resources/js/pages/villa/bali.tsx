import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';
import { PropertyCard, PropertyItem } from '@/components/PropertyCard';

const FALLBACK_IMAGES = [
    '/img/villa.png',
];

const DEMO_VILLAS: PropertyItem[] = [
    { id: 1, name: 'Villa Padi Ubud', location: 'Ubud, Bali', price: 'Rp 8.500.000', beds: 3, baths: 3, size: '450m²', rating: 4.9, tag: 'Best Seller' },
    { id: 2, name: 'Villa Tebing Jimbaran', location: 'Jimbaran, Bali', price: 'Rp 12.000.000', beds: 4, baths: 4, size: '650m²', rating: 4.8, tag: 'Luxury' },
    { id: 3, name: 'Villa Sawah Seminyak', location: 'Seminyak, Bali', price: 'Rp 6.200.000', beds: 2, baths: 2, size: '280m²', rating: 4.7, tag: 'Popular' },
    { id: 4, name: 'Villa Puncak Canggu', location: 'Canggu, Bali', price: 'Rp 9.800.000', beds: 3, baths: 3, size: '520m²', rating: 4.9, tag: 'New' },
];

export default function VillaBali() {
    const { settings, properties } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    // Use DB data if available, otherwise show demo items
    const items: PropertyItem[] = properties?.length > 0 ? properties : DEMO_VILLAS;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage    = get('hero_image', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=2400&q=90');
    const heroLabel    = get('hero_label', 'Villa Bali');
    const heroTitle    = get('hero_title', 'Surga Tropis di Pulau Dewata');
    const heroSubtitle = get('hero_subtitle', 'Temukan villa mewah pilihan kami di Bali — perpaduan sempurna antara arsitektur Balinese, alam tropis, dan kenyamanan modern.');
    const sectionTitle = get('section_title', 'Koleksi Villa Bali Kami');
    const sectionSub   = get('section_subtitle', 'Setiap villa dirancang untuk memberikan pengalaman liburan yang tak terlupakan di Pulau Dewata.');

    return (
        <PublicLayout title="Villa Bali">
            {/* ── Hero ── */}
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Villa Bali" className="h-full w-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/80" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-400/15 blur-[130px]" />
                </div>
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-amber-300/80 uppercase">{heroLabel}</motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {heroTitle.split(' ').slice(0, 2).join(' ')}{' '}
                            <span className="italic text-white/75">{heroTitle.split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">{heroSubtitle}</motion.p>
                        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <a href="#listings" className="rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-amber-400 hover:scale-105">Lihat Villa</a>
                            <a href="/about" className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10">Tentang Kami</a>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-xs tracking-widest text-white/40 uppercase">Scroll</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
                </motion.div>
            </div>

            {/* ── Listings ── */}
            <div id="listings" className="bg-[#fafafa] py-24">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-normal tracking-tight text-[#1a1a1a] md:text-[40px]">{sectionTitle}</h2>
                        <p className="mx-auto max-w-xl text-base text-[#6b6b6b]">{sectionSub}</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {items.map((item, idx) => (
                            <PropertyCard key={item.id} item={item} idx={idx} fallbackImages={FALLBACK_IMAGES} accentColor="amber" showType="villa" fadeUp={fadeUp} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── Why Bali ── */}
            <div className="bg-[#1a1a1a] py-24 text-white">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-normal md:text-[40px]">Mengapa <span className="italic text-amber-400">Villa Bali</span>?</h2>
                        <p className="mx-auto max-w-xl text-white/60">Bali menawarkan keindahan alam, budaya kaya, dan investasi properti bernilai tinggi.</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { icon: '🌴', title: 'Lokasi Premium', desc: 'Dekat pantai, sawah, dan destinasi wisata Bali paling populer.' },
                            { icon: '🏛️', title: 'Arsitektur Autentik', desc: 'Desain khas Bali yang memadukan material lokal dengan fasilitas modern.' },
                            { icon: '📈', title: 'Nilai Investasi', desc: 'ROI tinggi berkat permintaan wisata dan ekspat yang terus tumbuh.' },
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-colors hover:border-amber-400/30">
                                <div className="mb-4 text-4xl">{item.icon}</div>
                                <h4 className="mb-2 text-lg font-semibold">{item.title}</h4>
                                <p className="text-sm leading-relaxed text-white/60">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
