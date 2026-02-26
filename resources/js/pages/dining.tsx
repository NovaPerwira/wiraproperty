import React from 'react';
import { motion, Variants } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';

export default function Dining() {
    const fadeUpVariant: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <PublicLayout title="Culinary Dining">
            {/* Dark Hero */}
            <div className="pt-32 pb-24 bg-[#0A0A0A] border-b border-white/10 min-h-[50vh] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                    <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-normal tracking-tight mb-6">
                        Culinary <span className="italic text-white/70">Mastery</span>
                    </motion.h1>
                    <motion.p variants={fadeUpVariant} className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
                        A celebration of authentic local ingredients fused with international techniques. Each dish is a journey, crafted to elevate your senses.
                    </motion.p>
                </motion.div>
            </div>

            {/* Alternating Sections */}
            <div className="py-24 bg-[#fafafa]">
                <div className="max-w-[1200px] mx-auto px-8 flex flex-col gap-32">

                    {/* The Main Restaurant */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-[550px] rounded-3xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Main Restaurant" className="w-full h-full object-cover" />
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="lg:pl-8">
                            <span className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 block">Signature Dining</span>
                            <h2 className="text-3xl md:text-4xl font-normal text-[#1a1a1a] mb-6">Lumina Pavilion</h2>
                            <p className="text-lg text-[#6b6b6b] leading-relaxed mb-8">
                                Open all day, Lumina Pavilion boasts panoramic views of the cascading valley. Our chefs transform fresh morning catches and farm-to-table organic produce into vibrant masterpieces.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-[#121212] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg">
                                    Reserve a Table
                                </button>
                                <button className="bg-white border border-gray-200 text-[#1a1a1a] px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                                    View Menu
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* The Bar/Lounge */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="order-2 lg:order-1 lg:pr-8">
                            <span className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 block">Evening Lounge</span>
                            <h2 className="text-3xl md:text-4xl font-normal text-[#1a1a1a] mb-6">The Obsidian Bar</h2>
                            <p className="text-lg text-[#6b6b6b] leading-relaxed mb-8">
                                As dusk settles, retreat to The Obsidian Bar. Featuring rare vintages, artisanal spirits, and bespoke cocktails mixed by our award-winning mixologists in a moody, intimate atmosphere.
                            </p>
                            <button className="bg-white border border-gray-200 text-[#1a1a1a] px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                                Discover the Spirits
                            </button>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-[550px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
                            <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Obsidian Bar" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
