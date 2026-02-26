import React from 'react';
import { motion, Variants } from 'framer-motion';
import PublicLayout from '@/layouts/PublicLayout';
import { Map, Coffee, ShieldCheck, Wifi } from 'lucide-react';

export default function Experience() {
    const fadeUpVariant: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <PublicLayout title="The Experience">
            {/* Hero Section */}
            <div className="pt-32 pb-24 bg-[#0A0A0A] border-b border-white/10 min-h-[50vh] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                    <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-normal tracking-tight mb-6">
                        Beyond <span className="italic text-white/70">Accommodation</span>
                    </motion.h1>
                    <motion.p variants={fadeUpVariant} className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
                        A curated collection of sensory moments. From our signature infinity pool to deeply restorative spa treatments, every detail is crafted for your absolute well-being.
                    </motion.p>
                </motion.div>
            </div>

            {/* Highlights Grid */}
            <div className="py-24 bg-[#fafafa]">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
                            <h2 className="text-3xl md:text-4xl font-normal text-[#1a1a1a] mb-6">The Infinity Pool</h2>
                            <p className="text-lg text-[#6b6b6b] leading-relaxed mb-8">
                                Suspended between the sky and the lush valley below, our infinity pool offers a breathtaking vantage point. Lose yourself in the horizon while enjoying handcrafted refreshments from the sunken bar.
                            </p>
                            <button className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1a] border-b border-black pb-1 hover:text-black transition-colors">
                                Explore Pool Access
                            </button>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Infinity Pool" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-[500px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
                            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Wellness Spa" className="w-full h-full object-cover" />
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-normal text-[#1a1a1a] mb-6">Holistic Wellness</h2>
                            <p className="text-lg text-[#6b6b6b] leading-relaxed mb-8">
                                Reconnect with your inner balance. Our spa treatments merge ancient traditional techniques with modern therapeutic practices, using organic, locally-sourced botanical ingredients.
                            </p>
                            <button className="text-sm font-semibold uppercase tracking-wider text-[#1a1a1a] border-b border-black pb-1 hover:text-black transition-colors">
                                View Spa Menu
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Icon Facilities */}
            <div className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto px-8">
                    <motion.div
                        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                    >
                        {[
                            { icon: <Wifi size={32} />, title: "High-Speed Wi-Fi", desc: "Complimentary across all grounds" },
                            { icon: <Map size={32} />, title: "Concierge Planning", desc: "Customized local excursions" },
                            { icon: <Coffee size={32} />, title: "In-Room Dining", desc: "24/7 personalized service" },
                            { icon: <ShieldCheck size={32} />, title: "Private Security", desc: "Uncompromised safety & peace of mind" }
                        ].map((fac, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUpVariant}
                                className="flex flex-col items-center p-8 bg-transparent transition-all cursor-default group"
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="text-black mb-6 p-5 bg-[#fafafa] rounded-2xl group-hover:bg-[#f0f0f0] transition-colors"
                                >
                                    {fac.icon}
                                </motion.div>
                                <h4 className="font-semibold text-gray-900 mb-2">{fac.title}</h4>
                                <p className="text-sm text-gray-500">{fac.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
