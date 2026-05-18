import React, { useRef } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { usePage } from '@inertiajs/react';
import { PropertyCard, PropertyItem } from '@/components/PropertyCard';

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&w=1600&q=80',
];

const DEMO_VILLAS: PropertyItem[] = [
    { id: 1, name: 'Villa Pantai Senggigi', location: 'Senggigi, Lombok', price: 'Rp 5.500.000', beds: 3, baths: 2, size: '380m²', rating: 4.8, tag: 'Terlaris' },
    { id: 2, name: 'Villa Gunung Rinjani View', location: 'Sembalun, Lombok', price: 'Rp 7.200.000', beds: 4, baths: 3, size: '520m²', rating: 4.9, tag: 'Eksklusif' },
    { id: 3, name: 'Villa Gili Trawangan', location: 'Gili Trawangan, Lombok', price: 'Rp 9.000.000', beds: 3, baths: 3, size: '410m²', rating: 4.7, tag: 'Populer' },
    { id: 4, name: 'Villa Kuta Mandalika', location: 'Kuta, Lombok', price: 'Rp 6.800.000', beds: 2, baths: 2, size: '300m²', rating: 4.6, tag: 'Baru' },
];

export default function VillaLombok() {
    const { settings, properties } = usePage<any>().props;
    const get = (key: string, def: string) => settings?.[key]?.value || def;

    const items: PropertyItem[] = properties?.length > 0 ? properties : DEMO_VILLAS;

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } };
    const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    const heroImage    = get('hero_image', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2400&q=90');
    const heroLabel    = get('hero_label', 'Villa Lombok');
    const heroTitle    = get('hero_title', 'Keindahan Tersembunyi Pulau Seribu Masjid');
    const heroSubtitle = get('hero_subtitle', 'Lombok menawarkan pesona alam yang masih alami dengan pantai berpasir putih dan gunung yang megah. Temukan villa eksklusif kami di sini.');
    const sectionTitle = get('section_title', 'Koleksi Villa Lombok Kami');
    const sectionSub   = get('section_subtitle', 'Villa pilihan terbaik di destinasi eksotis Lombok dengan pemandangan spektakuler.');

    return (
        <PublicLayout title="Villa Lombok">
            <div ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
                    <img src={heroImage} alt="Villa Lombok" className="h-full w-full object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/80" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-teal-400/15 blur-[130px]" />
                    <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[110px]" />
                </div>
                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold tracking-[0.3em] text-teal-300/80 uppercase">{heroLabel}</motion.p>
                        <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-normal leading-tight tracking-tight drop-shadow-2xl md:text-7xl">
                            {heroTitle.split(' ').slice(0, 2).join(' ')}{' '}
                            <span className="italic text-white/75">{heroTitle.split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">{heroSubtitle}</motion.p>
                        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <a href="#listings" className="rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-teal-400 hover:scale-105">Lihat Villa</a>
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
                            <PropertyCard key={item.id} item={item} idx={idx} fallbackImages={FALLBACK_IMAGES} accentColor="amber" showType="villa" fadeUp={fadeUp} />
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="bg-[#0f2a2a] py-24 text-white">
                <div className="mx-auto max-w-[1200px] px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-normal md:text-[40px]">Mengapa <span className="italic text-teal-400">Villa Lombok</span>?</h2>
                        <p className="mx-auto max-w-xl text-white/60">Lombok — permata tersembunyi Indonesia dengan alam yang masih asri dan potensi wisata yang terus berkembang.</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { icon: '🏔️', title: 'Gunung Rinjani', desc: 'Berdekatan dengan destinasi pendakian terpopuler di Indonesia.' },
                            { icon: '🏖️', title: 'Pantai Eksotis', desc: 'Gili Islands dan pantai selatan Lombok dengan pasir putih memukau.' },
                            { icon: '🕌', title: 'Budaya & Kearifan Lokal', desc: 'Masyarakat Sasak yang ramah dengan budaya dan tradisi yang kaya.' },
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-colors hover:border-teal-400/30">
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
