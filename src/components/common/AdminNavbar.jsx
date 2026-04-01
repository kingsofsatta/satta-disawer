"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, LogOut } from "lucide-react";

const AdminNavbar = ({ title = "Site Configuration", subtitle = "Manage Good Luck and T1 site settings", backHref = "/admin" }) => {
    return (
        <header className="bg-white backdrop-blur-lg border-b border-black/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Back Button and Title */}
                    <div className="flex items-center min-w-0 flex-1">
                        <Link href={backHref} className="flex items-center text-black/80 hover:text-black mr-3">
                            <ArrowLeft size={22} className="mr-1" />
                            <span className="hidden sm:inline font-semibold">Back</span>
                        </Link>
                        <div className="bg-gradient2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                            <SettingsIcon size={16} className="text-black" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="roboto text-black text-sm sm:text-base lg:text-xl truncate">{title}</h1>
                            <p className="text-black/60 text-xs sm:text-sm truncate">{subtitle}</p>
                        </div>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <Link href="/admin/payment-proofs" className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base whitespace-nowrap">
                            <span className="mr-1 lg:mr-2">💳</span>
                            <span>Payment Proofs</span>
                        </Link>
                        <Link href="/admin/goodluck-config" className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base whitespace-nowrap">
                            <SettingsIcon size={16} className="mr-1 lg:mr-2" />
                            Good Luck Config
                        </Link>
                        <Link href="/admin/t1-config" className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base whitespace-nowrap">
                            <SettingsIcon size={16} className="mr-1 lg:mr-2" />
                            T1 Config
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem("authToken");
                                localStorage.removeItem("user");
                                window.location.href = "/login";
                            }}
                            className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base whitespace-nowrap"
                        >
                            <LogOut size={16} className="mr-1 lg:mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
