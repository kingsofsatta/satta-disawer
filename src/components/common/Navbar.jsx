"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScroll = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      if (scrollTop > 100) {
        // if (scrollTop > lastScroll.current) {
        //   // setShowNavbar(false);
        //   // setMobileMenuOpen(false);
        // } else {
        // }
        setShowNavbar(true);
      } else {
        setShowNavbar(true);
      }
      lastScroll.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const sattaLinks = [
    { id: 1, title: "Home", href: "/", icon: "🏠" },
    { id: 2, title: "Chart", href: "/chart", icon: "📊" },
    { id: 3, title: "Payment Proof", href: "/payment-proofs", icon: "💳" },
    { id: 4, title: "Contact", href: "/contact", icon: "📞" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Scroll Progress - Gradient Effect */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-900/50">
        <div
          className="h-1 bg-gradient-to-r from-amber-400 via-violet-500 to-amber-400 transition-all duration-150 shadow-lg shadow-amber-500/50"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navbar */}
      <nav
        className={`w-full z-40 transition-all duration-500 sticky top-0 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Main Nav Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border-b border-violet-500/30 shadow-xl shadow-violet-900/20">
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  <Image src="/logo.png" alt="Satta Disawer Logo" width={50} height={50} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm sm:text-lg font-black text-white leading-none">SATTA DISAWER</h1>
                  <p className="text-xs text-amber-400 font-semibold tracking-wider">SATTA</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                {sattaLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.id}
                    className={`relative px-3 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-1 lg:gap-2 overflow-hidden group ${isActive(link.href)
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/40"
                      : "text-white hover:text-amber-400"
                      }`}
                  >
                    {/* Hover background effect */}
                    {!isActive(link.href) && (
                      <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg lg:rounded-xl"></span>
                    )}
                    <span className="relative z-10 text-sm lg:text-base">{link.icon}</span>
                    <span className="relative z-10 hidden xl:inline">{link.title}</span>
                  </Link>
                ))}
              </div>

              {/* Live Badge */}
              <div className="hidden lg:flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-2 py-1 rounded-full flex-shrink-0">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <span className={`w-4 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`w-4 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`w-4 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-slate-900/95 backdrop-blur-lg border-b border-violet-500/30 overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[420px]" : "max-h-0"}`}>
          <div className="px-3 py-3 space-y-1.5">
            {sattaLinks.map((link) => (
              <Link
                href={link.href}
                key={link.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${isActive(link.href)
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                  : "text-white hover:bg-white/10"
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.title}</span>
                {isActive(link.href) && (
                  <span className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></span>
                )}
              </Link>
            ))}

            {/* Mobile Live Badge */}
            <div className="flex items-center justify-center gap-2 py-2 mt-2 border-t border-violet-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-xs font-bold">Live</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
