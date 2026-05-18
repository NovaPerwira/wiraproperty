import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { useCurrentUrl } from '@/hooks/use-current-url';

// --- Data Navigasi ---
const navItems = [
    {
        label: 'Villa',
        bgColor: 'rgba(255,255,255,0.03)',
        textColor: '#fff',
        links: [
            { label: 'Villa Bali', href: '/villa/bali', ariaLabel: 'Villa Bali' },
            { label: 'Villa Lombok', href: '/villa/lombok', ariaLabel: 'Villa Lombok' },
        ],
    },
    {
        label: 'Property',
        bgColor: 'rgba(255,255,255,0.03)',
        textColor: '#fff',
        links: [
            { label: 'Rumah', href: '/property/rumah', ariaLabel: 'Rumah' },
            { label: 'Ruko', href: '/property/ruko', ariaLabel: 'Ruko' },
            { label: 'Villa', href: '/property/villa', ariaLabel: 'Villa' },
        ],
    },
    {
        label: 'Tanah',
        bgColor: 'rgba(255,255,255,0.03)',
        textColor: '#fff',
        links: [
            { label: 'Tanah', href: '/tanah', ariaLabel: 'Tanah' },
        ],
    },
    {
        label: 'About',
        bgColor: 'rgba(255,255,255,0.03)',
        textColor: '#fff',
        links: [{ label: 'Our Story', href: '/about', ariaLabel: 'Our Story' }],
    },
];

// --- Komponen Mobile & Tablet CardNav ---
const MobileCardNav = ({
    logoName = 'Wira Property',
    items,
    hidden,
    isAtTop,
    lang,
    setLang,
}) => {
    const { isCurrentUrl } = useCurrentUrl();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showLangDrop, setShowLangDrop] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Deteksi jika layar adalah Tablet (>= 768px)
    useEffect(() => {
        const checkTablet = () => setIsTablet(window.innerWidth >= 768);
        checkTablet();
        window.addEventListener('resize', checkTablet);
        return () => window.removeEventListener('resize', checkTablet);
    }, []);

    const toggleMenu = () => setIsExpanded(!isExpanded);

    // Kunci scroll body saat menu mobile terbuka (hanya jika bukan mode auto tablet)
    useEffect(() => {
        if (isExpanded && !isTablet) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isExpanded, isTablet]);

    // Posisi Y dari atas untuk tablet dan mobile
    const getTopPosition = () => {
        if (hidden && !isExpanded) return -120;
        if (isTablet) return isAtTop ? 24 : 16;
        return 0; // Mobile selalu menempel atas
    };

    return (
        <div
            className="fixed left-1/2 z-[100] w-full -translate-x-1/2 transition-all duration-500 ease-in-out md:w-[90%] md:max-w-[768px]"
            style={{ top: `${getTopPosition()}px` }}
        >
            <motion.nav
                initial={false}
                animate={{
                    height: isExpanded ? (isTablet ? 'auto' : '100vh') : 64,
                }}
                className="relative w-full overflow-hidden border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:rounded-[2rem] md:border"
                style={{
                    backgroundColor: 'rgba(25, 25, 25, 0.45)', // Liquid Glass Base
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
                }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
                {/* Top Bar Mobile/Tablet */}
                <div className="absolute inset-x-0 top-0 z-20 flex h-[64px] items-center justify-between bg-transparent px-5 md:px-6">
                    <div className="flex cursor-pointer items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-medium tracking-tight text-white"
                            onClick={() => setIsExpanded(false)}
                        >
                            <LogoIcon />
                            {logoName}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Lang Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangDrop(!showLangDrop)}
                                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
                            >
                                <Globe size={16} /> {lang}{' '}
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${showLangDrop ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {showLangDrop && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-[120%] right-0 flex w-20 flex-col gap-1 rounded-xl border border-white/20 p-2 shadow-2xl"
                                        style={{
                                            backgroundColor:
                                                'rgba(30, 30, 30, 0.6)',
                                            backdropFilter:
                                                'blur(30px) saturate(150%)',
                                            WebkitBackdropFilter:
                                                'blur(30px) saturate(150%)',
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setLang('ID');
                                                setShowLangDrop(false);
                                            }}
                                            className={`rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${lang === 'ID' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            ID
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLang('EN');
                                                setShowLangDrop(false);
                                            }}
                                            className={`rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${lang === 'EN' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            EN
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Hamburger */}
                        <div
                            className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full text-white transition-colors hover:bg-white/10"
                            onClick={toggleMenu}
                        >
                            <div
                                className={`h-[2px] w-[22px] origin-center bg-current transition-all duration-300 ease-out ${isExpanded ? 'translate-y-[3.5px] rotate-45' : ''}`}
                            />
                            <div
                                className={`h-[2px] w-[22px] origin-center bg-current transition-all duration-300 ease-out ${isExpanded ? '-translate-y-[3.5px] -rotate-45' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Mobile/Tablet Menu */}
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isExpanded ? 1 : 0,
                        pointerEvents: isExpanded ? 'auto' : 'none',
                    }}
                    className={`relative z-10 flex flex-col gap-4 overflow-y-auto px-5 pt-[80px] md:px-6 ${isTablet ? 'max-h-[75vh] pb-6' : 'h-full pb-24'}`}
                >
                    {items.map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card relative flex flex-col gap-3 rounded-2xl border border-white/10 p-5"
                            style={{
                                backgroundColor: item.bgColor,
                                color: item.textColor,
                            }}
                        >
                            <div className="text-xl font-medium tracking-tight text-white/90">
                                {item.label}
                            </div>
                            <div className="flex flex-col gap-2">
                                {item.links?.map((lnk, i) => {
                                    const isActive = isCurrentUrl(lnk.href);
                                    return (
                                        <Link
                                            key={`${lnk.label}-${i}`}
                                            href={lnk.href}
                                            onClick={() => setIsExpanded(false)}
                                            className={`group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 no-underline transition-all duration-300 ${isActive ? 'border-white/20 bg-white/20 font-medium text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]' : 'border-transparent bg-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            <span className="flex items-center gap-3 text-sm">
                                                {isActive ? (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                                ) : (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-transparent transition-colors duration-300 group-hover:bg-white/40" />
                                                )}
                                                {lnk.label}
                                            </span>
                                            <ArrowUpRight
                                                size={18}
                                                className={`transition-transform duration-300 ${isActive ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-2 translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100'}`}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.nav>
        </div>
    );
};

// --- Komponen Desktop Fluid Nav ---
const DesktopFluidNav = ({
    logoName = 'Wira Property',
    items,
    hidden,
    isAtTop,
    lang,
    setLang,
}) => {
    const { isCurrentUrl } = useCurrentUrl();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredNav, setHoveredNav] = useState(null);
    const [hoveredLang, setHoveredLang] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pointer-events-none fixed top-0 right-0 left-0 z-[100] flex justify-center px-6">
            <motion.nav
                initial={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    opacity: 0,
                    y: 32,
                }}
                animate={{
                    width: isLoaded ? 'min(95vw, 1200px)' : 64,
                    height: 64,
                    borderRadius: 32,
                    opacity: 1,
                    y: hidden ? -100 : isAtTop ? 32 : 16,
                    // Liquid Glass iOS Style
                    backgroundColor: isAtTop
                        ? 'rgba(25, 25, 25, 0.25)'
                        : 'rgba(25, 25, 25, 0.45)',
                    borderColor: isAtTop
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    boxShadow:
                        '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)',
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    y: { type: 'spring', stiffness: 300, damping: 30 },
                }}
                className="pointer-events-auto flex items-center justify-between border px-3"
            >
                <AnimatePresence>
                    {isLoaded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex h-full w-full items-center justify-between"
                        >
                            {/* Logo */}
                            <div className="group flex items-center pl-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3"
                                >
                                    <LogoIcon />
                                    <span className="text-lg font-semibold tracking-tight text-white">
                                        {logoName}
                                    </span>
                                </Link>
                            </div>

                            {/* Tautan Desktop */}
                            <div className="flex h-full items-center space-x-2">
                                {items.map((category) => {
                                    const isActive = category.links.some(
                                        (link) => isCurrentUrl(link.href),
                                    );

                                    return (
                                        <div
                                            key={category.label}
                                            onMouseEnter={() =>
                                                setHoveredNav(category.label)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredNav(null)
                                            }
                                            className="group relative flex h-full cursor-pointer items-center px-2"
                                        >
                                            <Link
                                                href={category.links[0]?.href}
                                                className="relative flex items-center gap-1.5 rounded-full px-5 py-2.5 transition-colors"
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="desktop-active-pill"
                                                        className="absolute inset-0 rounded-full border border-white/20 bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                                        initial={false}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 400,
                                                            damping: 35,
                                                        }}
                                                    />
                                                )}
                                                <span
                                                    className={`relative z-10 text-sm transition-colors duration-300 ${isActive ? 'font-medium text-white' : 'text-white/70 group-hover:text-white'}`}
                                                >
                                                    {category.label}
                                                </span>
                                                <ChevronDown
                                                    size={14}
                                                    className={`relative z-10 transition-transform duration-300 ${hoveredNav === category.label ? 'rotate-180 text-white' : 'text-white/50 group-hover:text-white'}`}
                                                />
                                            </Link>

                                            {/* Dropdown Panel - Liquid Glass */}
                                            <AnimatePresence>
                                                {hoveredNav ===
                                                    category.label && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            y: 15,
                                                            scale: 0.95,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            scale: 1,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: 10,
                                                            scale: 0.95,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                            ease: 'easeOut',
                                                        }}
                                                        className="absolute top-[85%] left-1/2 z-50 mt-4 w-[280px] -translate-x-1/2 overflow-hidden rounded-[1.5rem] border border-white/20 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                                                        style={{
                                                            backgroundColor:
                                                                isAtTop
                                                                    ? 'rgba(93, 114, 148, 0.96)'
                                                                    : 'rgba(25, 25, 25, 0.45)',
                                                            borderColor: isAtTop
                                                                ? 'rgba(255, 255, 255, 0.1)'
                                                                : 'rgba(255, 255, 255, 0.2)',
                                                            backdropFilter:
                                                                'blur(40px) saturate(180%)',
                                                            WebkitBackdropFilter:
                                                                'blur(40px) saturate(180%)',
                                                            boxShadow:
                                                                '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)',
                                                        }}
                                                    >
                                                        <div className="flex flex-col gap-1.5 p-3">
                                                            <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
                                                                {category.label}
                                                            </div>
                                                            {category.links.map(
                                                                (lnk) => {
                                                                    const isLinkActive =
                                                                        isCurrentUrl(
                                                                            lnk.href,
                                                                        );
                                                                    return (
                                                                        <Link
                                                                            key={
                                                                                lnk.href
                                                                            }
                                                                            href={
                                                                                lnk.href
                                                                            }
                                                                            onClick={() =>
                                                                                setHoveredNav(
                                                                                    null,
                                                                                )
                                                                            }
                                                                            className={`group/link flex items-center justify-between rounded-xl p-3.5 transition-all duration-300 ${isLinkActive ? 'border border-white/10 bg-white/20 text-white shadow-sm' : 'border border-transparent text-white/70 hover:bg-white/[0.08] hover:text-white'}`}
                                                                        >
                                                                            <span className="flex items-center gap-3 text-sm font-medium">
                                                                                {isLinkActive ? (
                                                                                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                                                                ) : (
                                                                                    <span className="h-1.5 w-1.5 rounded-full bg-transparent transition-colors group-hover/link:bg-white/50" />
                                                                                )}
                                                                                {
                                                                                    lnk.label
                                                                                }
                                                                            </span>
                                                                            <ArrowUpRight
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className={`transition-transform duration-300 ${isLinkActive ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-2 translate-y-2 opacity-0 group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-hover/link:opacity-100'}`}
                                                                            />
                                                                        </Link>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bagian Kanan */}
                            <div className="flex h-full items-center gap-2 pr-2">
                                {/* Language Dropdown - Liquid Glass */}
                                <div
                                    className="relative flex h-full items-center px-2"
                                    onMouseEnter={() => setHoveredLang(true)}
                                    onMouseLeave={() => setHoveredLang(false)}
                                >
                                    <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                                        <Globe size={16} /> {lang}
                                    </button>
                                    <AnimatePresence>
                                        {hoveredLang && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-[85%] right-0 z-50 mt-2 flex w-32 flex-col gap-1 rounded-[1.2rem] border border-white/20 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                                                style={{
                                                    backgroundColor: isAtTop
                                                        ? 'rgba(93, 114, 148, 0.96)'
                                                        : 'rgba(25, 25, 25, 0.45)',
                                                    borderColor: isAtTop
                                                        ? 'rgba(255, 255, 255, 0.1)'
                                                        : 'rgba(255, 255, 255, 0.2)',
                                                    backdropFilter:
                                                        'blur(40px) saturate(180%)',
                                                    WebkitBackdropFilter:
                                                        'blur(40px) saturate(180%)',
                                                    boxShadow:
                                                        '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)',
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        setLang('ID')
                                                    }
                                                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${lang === 'ID' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                                >
                                                    Indonesia{' '}
                                                    {lang === 'ID' && (
                                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setLang('EN')
                                                    }
                                                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${lang === 'EN' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                                >
                                                    English{' '}
                                                    {lang === 'EN' && (
                                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* CTA Button → WhatsApp */}
                                <a
                                    href="https://wa.me/6285739493437?text=Halo%20Wira%20Property%2C%20saya%20ingin%20informasi%20lebih%20lanjut"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 inline-flex cursor-pointer items-center gap-2 rounded-full border-0 px-6 py-2.5 text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        backgroundColor: '#25D366',
                                        color: '#ffffff',
                                    }}
                                >
                                    💬 Hubungi Kami
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};

// --- Helper Komponen ---
const LogoIcon = () => (
    <img
        src="/logo.svg"
        alt="Logo"
        className="flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform group-hover:scale-110"
        width={32}
        height={32}
    />
);

// --- App Utama ---
export default function Navbar() {
    const [lang, setLang] = useState('EN');
    const [isMobile, setIsMobile] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const lastScrollY = useRef(0);

    // Deteksi Breakpoint 1024px
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Deteksi Scroll Behavior
    // useEffect(() => {
    //   const handleScroll = () => {
    //     const currentScrollY = window.scrollY;
    //     if (currentScrollY > lastScrollY.current && currentScrollY > 1) {
    //       setHidden(true);
    //     } else {
    //       setHidden(false);
    //     }
    //     setIsAtTop(currentScrollY < 50);
    //     lastScrollY.current = currentScrollY;
    //   };

    //   window.addEventListener('scroll', handleScroll, { passive: true });
    //   return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    return (
        <div className="relative overflow-x-hidden bg-[#0A0A0A] font-sans text-white selection:bg-white/30">
            {/* Render komponen Nav */}
            {isMobile ? (
                <MobileCardNav
                    logoName="Wira Property"
                    items={navItems}
                    hidden={hidden}
                    isAtTop={isAtTop}
                    lang={lang}
                    setLang={setLang}
                />
            ) : (
                <DesktopFluidNav
                    logoName="Wira Property"
                    items={navItems}
                    hidden={hidden}
                    isAtTop={isAtTop}
                    lang={lang}
                    setLang={setLang}
                />
            )}
        </div>
    );
}
