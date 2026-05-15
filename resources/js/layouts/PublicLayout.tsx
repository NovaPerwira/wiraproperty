import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navbar';

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
            <Head title={title ? `${title} | Stayli` : 'Stayli'} />

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

            <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0A0A0A] font-sans text-white selection:bg-white/30">
                <Navbar />

                {/* Main Content Area */}
                <main className="w-full flex-1">{children}</main>

                {/* Minimalist Footer */}
                <footer className="relative z-20 mt-auto bg-white py-12 text-sm text-[#6b6b6b]">
                    <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-8 md:flex-row">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex cursor-pointer items-center font-medium text-[#1a1a1a]"
                        >
                            <Logo /> Stayli
                        </motion.div>
                        <div className="flex space-x-8">
                            <motion.a
                                whileHover={{ y: -2, color: '#1a1a1a' }}
                                href="#"
                                className="transition-colors"
                            >
                                Privacy
                            </motion.a>
                            <motion.a
                                whileHover={{ y: -2, color: '#1a1a1a' }}
                                href="#"
                                className="transition-colors"
                            >
                                Terms
                            </motion.a>
                            <motion.a
                                whileHover={{ y: -2, color: '#1a1a1a' }}
                                href="#"
                                className="transition-colors"
                            >
                                Sitemap
                            </motion.a>
                        </div>
                        <p>&copy; {new Date().getFullYear()} Stayli Inc.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
