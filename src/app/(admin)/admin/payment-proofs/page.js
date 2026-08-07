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
            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mb-4"></div>
                    <p className="text-white font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white">Payment Proof Management</h1>
                        <p className="mt-2 text-sm text-slate-300">Manage and upload payment proofs for display on the public page.</p>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20">
                <PaymentProofSection />
            </div>
        </div>
    );
}
