import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';

// --- Data Navigasi ---
const navItems = [
  {
    label: "Hero",
    bgColor: "rgba(255,255,255,0.03)",
    textColor: "#fff",
    links: [
      { label: "Welcome Page", href: "/", ariaLabel: "Home Page" },
    ]
  },
  {
    label: "Rooms",
    bgColor: "rgba(255,255,255,0.03)",
    textColor: "#fff",
    links: [
      { label: "Our Stays", href: "/stays", ariaLabel: "All Stays" },
    ]
  },
  {
    label: "Experience",
    bgColor: "rgba(255,255,255,0.03)",
    textColor: "#fff",
    links: [
      { label: "Wellness & Spa", href: "/experience", ariaLabel: "Wellness Experiences" },
    ]
  },
  {
    label: "Dining",
    bgColor: "rgba(255,255,255,0.03)",
    textColor: "#fff",
    links: [
      { label: "Restaurants & Bars", href: "/dining", ariaLabel: "Dining Options" },
    ]
  },
  {
    label: "About",
    bgColor: "rgba(255,255,255,0.03)",
    textColor: "#fff",
    links: [
      { label: "Our Story", href: "/about", ariaLabel: "Our Story" },
    ]
  }
];

// --- Komponen Mobile & Tablet CardNav ---
const MobileCardNav = ({
  logoName = 'Stayli',
  items,
  activePath,
  onNavigate,
  hidden,
  isAtTop,
  lang,
  setLang
}) => {
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
    return () => { document.body.style.overflow = 'unset'; };
  }, [isExpanded, isTablet]);

  // Posisi Y dari atas untuk tablet dan mobile
  const getTopPosition = () => {
    if (hidden && !isExpanded) return -120;
    if (isTablet) return isAtTop ? 24 : 16;
    return 0; // Mobile selalu menempel atas
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 w-full md:w-[90%] md:max-w-[768px] z-[100] transition-all duration-500 ease-in-out"
      style={{ top: `${getTopPosition()}px` }}
    >
      <motion.nav
        initial={false}
        animate={{ height: isExpanded ? (isTablet ? 'auto' : '100vh') : 64 }}
        className="w-full relative overflow-hidden md:rounded-[2rem] border-b md:border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          backgroundColor: 'rgba(25, 25, 25, 0.45)', // Liquid Glass Base
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
        }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Top Bar Mobile/Tablet */}
        <div className="absolute inset-x-0 top-0 h-[64px] flex items-center justify-between px-5 md:px-6 z-20 bg-transparent">
          <div className="flex items-center cursor-pointer" onClick={() => { onNavigate('/home'); setIsExpanded(false); }}>
            <span className="text-white text-xl font-medium tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              {logoName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Lang Selector */}
            <div className="relative">
              <button onClick={() => setShowLangDrop(!showLangDrop)} className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium">
                <Globe size={16} /> {lang} <ChevronDown size={14} className={`transition-transform ${showLangDrop ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showLangDrop && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[120%] right-0 rounded-xl p-2 flex flex-col gap-1 w-20 shadow-2xl border border-white/20"
                    style={{
                      backgroundColor: 'rgba(30, 30, 30, 0.6)',
                      backdropFilter: 'blur(30px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(150%)'
                    }}
                  >
                    <button onClick={() => { setLang('ID'); setShowLangDrop(false); }} className={`px-2 py-1.5 rounded-lg text-sm text-left transition-colors ${lang === 'ID' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>ID</button>
                    <button onClick={() => { setLang('EN'); setShowLangDrop(false); }} className={`px-2 py-1.5 rounded-lg text-sm text-left transition-colors ${lang === 'EN' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>EN</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger */}
            <div className="h-10 w-10 flex flex-col items-center justify-center cursor-pointer gap-[5px] rounded-full hover:bg-white/10 transition-colors text-white" onClick={toggleMenu}>
              <div className={`w-[22px] h-[2px] bg-current transition-all duration-300 ease-out origin-center ${isExpanded ? 'translate-y-[3.5px] rotate-45' : ''}`} />
              <div className={`w-[22px] h-[2px] bg-current transition-all duration-300 ease-out origin-center ${isExpanded ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
            </div>
          </div>
        </div>

        {/* Content Mobile/Tablet Menu */}
        <motion.div
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0, pointerEvents: isExpanded ? 'auto' : 'none' }}
          className={`px-5 md:px-6 pt-[80px] flex flex-col gap-4 z-10 relative overflow-y-auto ${isTablet ? 'pb-6 max-h-[75vh]' : 'pb-24 h-full'}`}
        >
          {items.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="nav-card relative flex flex-col gap-3 p-5 rounded-2xl border border-white/10" style={{ backgroundColor: item.bgColor, color: item.textColor }}>
              <div className="font-medium tracking-tight text-xl text-white/90">{item.label}</div>
              <div className="flex flex-col gap-2">
                {item.links?.map((lnk, i) => {
                  const isActive = activePath === lnk.href;
                  return (
                    <Link
                      key={`${lnk.label}-${i}`}
                      href={lnk.href}
                      onClick={() => { onNavigate(lnk.href); toggleMenu(); }}
                      className={`flex items-center justify-between no-underline cursor-pointer transition-all duration-300 group px-4 py-3 rounded-xl border ${isActive ? 'bg-white/20 text-white font-medium border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' : 'bg-transparent border-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        {isActive ? <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0 group-hover:bg-white/40 transition-colors duration-300" />}
                        {lnk.label}
                      </span>
                      <ArrowUpRight size={18} className={`transition-transform duration-300 ${isActive ? 'translate-x-0 translate-y-0 opacity-100' : 'opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'}`} />
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
  logoName = 'Stayli',
  items,
  activePath,
  onNavigate,
  hidden,
  isAtTop,
  lang,
  setLang
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredLang, setHoveredLang] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-6">
      <motion.nav
        initial={{ width: 64, height: 64, borderRadius: 32, opacity: 0, y: 32 }}
        animate={{
          width: isLoaded ? "min(95vw, 1200px)" : 64,
          height: 64,
          borderRadius: 32,
          opacity: 1,
          y: hidden ? -100 : (isAtTop ? 32 : 16),
          // Liquid Glass iOS Style
          backgroundColor: isAtTop ? "rgba(25, 25, 25, 0.25)" : "rgba(25, 25, 25, 0.45)",
          borderColor: isAtTop ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)"
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], y: { type: "spring", stiffness: 300, damping: 30 } }}
        className="flex items-center justify-between px-3 pointer-events-auto border"
      >
        <AnimatePresence>
          {isLoaded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex items-center justify-between w-full h-full">

              {/* Logo */}
              <div className="flex items-center cursor-pointer pl-4 group" onClick={(e) => { e.preventDefault(); onNavigate('/home'); }}>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  <div className="w-2.5 h-2.5 bg-black rounded-full" />
                </div>
                <span className="text-white text-lg font-semibold tracking-tight">{logoName}</span>
              </div>

              {/* Tautan Desktop */}
              <div className="flex items-center space-x-2 h-full">
                {items.map((category) => {
                  const isActive = category.links.some(link => link.href === activePath);

                  return (
                    <div
                      key={category.label}
                      onMouseEnter={() => setHoveredNav(category.label)}
                      onMouseLeave={() => setHoveredNav(null)}
                      className="relative h-full flex items-center px-2 cursor-pointer group"
                    >
                      <Link href={category.links[0]?.href} onClick={() => { onNavigate(category.links[0]?.href); }} className="relative px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-colors">
                        {isActive && (
                          <motion.div layoutId="desktop-active-pill" className="absolute inset-0 bg-white/15 border border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]" initial={false} transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                        )}
                        <span className={`relative z-10 text-sm transition-colors duration-300 ${isActive ? 'text-white font-medium' : 'text-white/70 group-hover:text-white'}`}>
                          {category.label}
                        </span>
                        <ChevronDown size={14} className={`relative z-10 transition-transform duration-300 ${(hoveredNav === category.label) ? 'rotate-180 text-white' : 'text-white/50 group-hover:text-white'}`} />
                      </Link>

                      {/* Dropdown Panel - Liquid Glass */}
                      <AnimatePresence>
                        {hoveredNav === category.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-4 w-[280px] p-2 rounded-[1.5rem] border border-white/20  shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                            style={{
                              backgroundColor: isAtTop ? "rgba(93, 114, 148, 0.96)" : "rgba(25, 25, 25, 0.45)",
                              borderColor: isAtTop ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(40px) saturate(180%)",
                              WebkitBackdropFilter: "blur(40px) saturate(180%)",
                              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)"
                            }}
                          >
                            <div className="flex flex-col gap-1.5 p-3">
                              <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 px-2">{category.label}</div>
                              {category.links.map((lnk) => {
                                const isLinkActive = activePath === lnk.href;
                                return (
                                  <Link key={lnk.href} href={lnk.href} onClick={() => { onNavigate(lnk.href); setHoveredNav(null); }} className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group/link ${isLinkActive ? 'bg-white/20 text-white border border-white/10 shadow-sm' : 'hover:bg-white/[0.08] border border-transparent text-white/70 hover:text-white'}`}>
                                    <span className="flex items-center gap-3 text-sm font-medium">
                                      {isLinkActive ? <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" /> : <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover/link:bg-white/50 transition-colors" />}
                                      {lnk.label}
                                    </span>
                                    <ArrowUpRight size={16} className={`transition-transform duration-300 ${isLinkActive ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-2 translate-y-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:translate-y-0'}`} />
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Bagian Kanan */}
              <div className="flex items-center gap-2 pr-2 h-full">

                {/* Language Dropdown - Liquid Glass */}
                <div
                  className="relative flex items-center h-full px-2"
                  onMouseEnter={() => setHoveredLang(true)}
                  onMouseLeave={() => setHoveredLang(false)}
                >
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium">
                    <Globe size={16} /> {lang}
                  </button>
                  <AnimatePresence>
                    {hoveredLang && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[85%] right-0 mt-2 p-2 rounded-[1.2rem] flex flex-col gap-1 w-32 shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-white/20 z-50"
                        style={{
                          backgroundColor: isAtTop ? "rgba(93, 114, 148, 0.96)" : "rgba(25, 25, 25, 0.45)",
                          borderColor: isAtTop ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
                          backdropFilter: "blur(40px) saturate(180%)",
                          WebkitBackdropFilter: "blur(40px) saturate(180%)",
                          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)"
                        }}
                      >
                        <button onClick={() => setLang('ID')} className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-colors ${lang === 'ID' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>Indonesia {lang === 'ID' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</button>
                        <button onClick={() => setLang('EN')} className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between transition-colors ${lang === 'EN' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>English {lang === 'EN' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA Button */}
                <button className="border-0 rounded-full px-6 py-2.5 text-sm font-semibold items-center cursor-pointer transition-all hover:scale-105 active:scale-95 ml-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]" style={{ backgroundColor: '#ffffff', color: '#121212' }}>
                  Book Now
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

// --- App Utama ---
export default function Navbar() {
  const [currentPage, setCurrentPage] = useState('/featured');
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
    <div className="bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative selection:bg-white/30">


      {/* Render komponen Nav */}
      {isMobile ? (
        <MobileCardNav logoName="Stayli" items={navItems} activePath={currentPage} onNavigate={setCurrentPage} hidden={hidden} isAtTop={isAtTop} lang={lang} setLang={setLang} />
      ) : (
        <DesktopFluidNav logoName="Stayli" items={navItems} activePath={currentPage} onNavigate={setCurrentPage} hidden={hidden} isAtTop={isAtTop} lang={lang} setLang={setLang} />
      )}

    </div>
  );
}