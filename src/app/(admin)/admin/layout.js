"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Database, CreditCard, SlidersHorizontal, Sparkles, Settings, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/update-data", label: "Update Data", icon: Database },
  { href: "/admin/payment-proofs", label: "Payment Proofs", icon: CreditCard },
  { href: "/admin/site-config", label: "Site Config", icon: Settings },
  { href: "/admin/goodluck-config", label: "Good Luck Config", icon: Sparkles },
  { href: "/admin/t1-config", label: "T1 Config", icon: SlidersHorizontal },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // close mobile drawer when navigating
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-white/10 bg-slate-950/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto px-4 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400 font-semibold">Admin Dashboard</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black">Satta Disawer Control Center</h1>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-slate-100 shadow-sm shadow-black/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle admin menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside className={`absolute left-0 top-10 h-full w-[min(18rem,90vw)] max-w-sm bg-slate-900/95 p-4 shadow-2xl shadow-black/30 transform-gpu transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Admin Menu</p>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-slate-100 transition hover:bg-slate-800"
              onClick={() => setMobileOpen(false)}
              aria-label="Close admin menu"
            >
              <X size={16} />
            </button>
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-orange-500 text-black" : "text-slate-200 hover:bg-slate-800"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      <div className="mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block sticky top-24 self-start rounded-3xl border border-white/10 bg-slate-900/85 p-5 shadow-xl shadow-black/20 h-[80vh]">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Admin Menu</p>
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-orange-500 text-black" : "bg-slate-950/80 text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}

