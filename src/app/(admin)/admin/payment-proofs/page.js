"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentProofSection from "@/components/PaymentProofSection";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPaymentProofs() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");

        if (!token) {
            router.push("/login");
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mb-4"></div>
                    <p className="text-white font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border-b border-violet-500/30 shadow-xl shadow-violet-900/20">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href="/admin"
                            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="text-amber-400" />
                        </Link>
                        <h1 className="text-3xl font-black text-white">Payment Proof Management</h1>
                    </div>
                    <p className="text-gray-400 ml-11">Manage and upload payment proofs for display on the public page</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <PaymentProofSection />
            </div>
        </div>
    );
}
