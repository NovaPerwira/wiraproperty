import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navbar';

// Smooth scroll global style
const smoothScrollStyle: React.CSSProperties = {
    scrollBehavior: 'smooth',
};

const WA_LINK = 'https://wa.me/6285739493437?text=Halo%20Wira%20Property%2C%20saya%20ingin%20informasi%20lebih%20lanjut';

// Using the same SVG logo as welcome.tsx
const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`mr-2 ${props.className || ''}`}
        {...props}
    >
        <path
            d="M4 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H4V4Z"
            fill="white"
        />
        <path
            d="M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8V8Z"
            fill="#1a1a1a"
        />
    </svg>
);

interface PublicLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function PublicLayout({ title, children }: PublicLayoutProps) {
    const [isLoading, setIsLoading] = useState<boolean>(() => {
        // Only show splash screen on very first load of the session
        if (typeof window !== 'undefined') {
            return !window.sessionStorage.getItem('hasSeenSplash');
        }
        return true;
    });

    // Splashscreen Effect
    useEffect(() => {
        if (!isLoading) return;

        const timer = setTimeout(() => {
            setIsLoading(false);
            window.sessionStorage.setItem('hasSeenSplash', 'true');
        }, 800);
        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <>
            <Head title={title ? `${title} | Wira Property` : 'Wira Property'} />

            {/* Minimalist Splashscreen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.8, ease: 'easeInOut' },
                        }}
                        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0A0A0A]"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 90, 90],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Logo width={48} height={48} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0A0A0A] font-sans text-white selection:bg-white/30" style={smoothScrollStyle}>
                <Navbar />

                {/* ── Floating WhatsApp Button ── */}
                <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-float"
                    aria-label="Hubungi Wira Property via WhatsApp"
                >
                    {/* WhatsApp SVG Icon */}
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Hubungi Kami
                </a>

                {/* Main Content Area */}
                <main className="w-full flex-1">{children}</main>

                {/* Minimalist Footer */}
                <footer className="relative z-20 mt-auto bg-white py-12 text-sm text-[#6b6b6b]">
                    <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-8 md:flex-row">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex cursor-pointer items-center font-medium text-[#1a1a1a]"
                        >
                            <Logo /> Wira Property
                        </motion.div>
                        <div className="flex space-x-8">
                            <motion.a
                                whileHover={{ y: -2, color: '#1a1a1a' }}
                                href={WA_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors"
                            >
                                💬 WhatsApp
                            </motion.a>
                            <motion.a
                                whileHover={{ y: -2, color: '#1a1a1a' }}
                                href="/about"
                                className="transition-colors"
                            >
                                About
                            </motion.a>
                        </div>
                        <p>&copy; {new Date().getFullYear()} Wira Property. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
