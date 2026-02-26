import React from 'react';
import { motion, Variants } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { MapPin, Map } from 'lucide-react';

export default function About() {
    const fadeUpVariant: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <PublicLayout title="Our Story">
            {/* Story Hero */}
            <div className="pt-32 pb-24 bg-[#0A0A0A] border-b border-white/10 min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1542314831-c6a4d1409360?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Resort Background" className="w-full h-full object-cover blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>

                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-normal tracking-tight mb-8">
                        The <span className="italic text-white/70">Stayli</span> Vision
                    </motion.h1>
                    <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
                        Born from a desire to redefine luxury, Stayli bridges the gap between raw natural beauty and uncompromising modern comfort. We don't just host guests; we curate deeply personal journeys.
                    </motion.p>
                </motion.div>
            </div>

            {/* Philosophy text */}
            <div className="py-24 bg-white">
                <div className="max-w-[800px] mx-auto px-8 text-center space-y-8">
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-lg text-[#6b6b6b] leading-loose">
                        Founded in 2020 by a collective of visionary architects and local artisans, Stayli was constructed with complete respect for the surrounding landscape. Every stone laid, every fixture chosen, reflects our commitment to sustainable elegance.
                    </motion.p>
                    <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="text-lg text-[#6b6b6b] leading-loose">
                        We believe that true luxury lies in absolute peace—a sanctuary where time slows down, allowing you to reconnect with yourself, your loved ones, and the environment.
                    </motion.p>
                </div>
            </div>

            {/* Reusing Location Section from welcome.tsx to anchor the About page */}
            <div className="py-24 bg-[#fafafa] border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row gap-16 items-center">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
                        className="md:w-1/2"
                    >
                        <h2 className="text-3xl md:text-[40px] font-normal text-gray-900 mb-6 tracking-tight">Strategic Haven in Tabanan</h2>
                        <p className="text-[#6b6b6b] mb-10 text-lg leading-relaxed">
                            Surrounded by the authentic natural grace of Bali, yet entirely accessible from major cultural and geographic landmarks.
                        </p>
                        <ul className="space-y-6">
                            {[
                                { text: "Kedungu Beach", dist: "10 Minutes Drive" },
                                { text: "Tanah Lot Temple", dist: "15 Minutes Drive" },
                                { text: "Canggu Area", dist: "30 Minutes Drive" },
                                { text: "Ngurah Rai Airport", dist: "1.5 Hours Drive" }
                            ].map((loc, i) => (
                                <motion.li
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center gap-4 text-[#1a1a1a] cursor-default"
                                >
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <span className="font-medium block">{loc.text}</span>
                                        <span className="text-sm text-[#8c8c8c]">{loc.dist}</span>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="md:w-1/2 w-full h-[450px] bg-gray-200 rounded-[40px] overflow-hidden relative shadow-lg group"
                    >
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Bali Map View" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-500">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
                                className="bg-white text-black px-8 py-4 rounded-full font-medium shadow-xl flex items-center gap-2"
                            >
                                <Map size={18} /> Open in Google Maps
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
