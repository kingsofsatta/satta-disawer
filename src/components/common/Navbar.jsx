"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        if (scrollTop > lastScroll.current) {
          setShowNavbar(false);
          setMobileMenuOpen(false);
        } else {
          setShowNavbar(true);
        }
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
    { id: 3, title: "Contact", href: "/contact", icon: "📞" },
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
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <span className="text-xl">🎯</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-black text-white leading-none">GOOD LUCK</h1>
                  <p className="text-xs text-amber-400 font-semibold tracking-wider">SATTA RESULT</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {sattaLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.id}
                    className={`relative px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-2 overflow-hidden group ${isActive(link.href)
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/40"
                        : "text-white hover:text-amber-400"
                      }`}
                  >
                    {/* Hover background effect */}
                    {!isActive(link.href) && (
                      <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl"></span>
                    )}
                    <span className="relative z-10">{link.icon}</span>
                    <span className="relative z-10">{link.title}</span>
                    {/* Active indicator dot */}
                    {isActive(link.href) && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Live Badge */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live</span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle menu"
              >
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-slate-900/95 backdrop-blur-lg border-b border-violet-500/30 overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-64" : "max-h-0"}`}>
          <div className="px-4 py-4 space-y-2">
            {sattaLinks.map((link) => (
              <Link
                href={link.href}
                key={link.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${isActive(link.href)
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                    : "text-white hover:bg-white/10"
                  }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.title}</span>
                {isActive(link.href) && (
                  <span className="ml-auto w-2 h-2 bg-slate-900 rounded-full"></span>
                )}
              </Link>
            ))}
            {/* Mobile Live Badge */}
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-bold">Results Updated Live</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
