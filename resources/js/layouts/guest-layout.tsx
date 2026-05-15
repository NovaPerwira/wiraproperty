import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { AnimatePresence, motion } from 'framer-motion';

// Logo SVG Component
const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mr-2 ${props.className || ''}`} {...props}>
        <path d="M4 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H4V4Z" fill="white" />
        <path d="M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8V8Z" fill="#1a1a1a" />
    </svg>
);

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return !window.sessionStorage.getItem('hasSeenSplash');
        }
        return true;
    });

    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => {
            setIsLoading(false);
            window.sessionStorage.setItem('hasSeenSplash', 'true');
        }, 1500);
        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1a1a] text-white"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="mb-8 flex items-center text-4xl font-medium tracking-tight"
                        >
                            <Logo /> Stayli
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <Navbar />
            
            <div className="relative min-h-screen overflow-x-hidden bg-white pb-20 font-sans text-gray-900 md:pb-0">
                {children}
            </div>
            
            {/* Minimalist Footer inside Layout */}
            <footer className="bg-[#121212] text-white/60 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center text-white text-xl font-medium">
                        <Logo /> Stayli
                    </div>
                    <div className="text-sm">
                        &copy; {new Date().getFullYear()} Stayli. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    );
}
