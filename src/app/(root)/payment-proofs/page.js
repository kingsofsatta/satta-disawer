"use client";
import { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";

const PaymentProofsPage = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState(null);

    useEffect(() => {
        loadProofs();
    }, []);

    const loadProofs = async () => {
        try {
            const response = await fetch("/api/payments?active=true");
            if (!response.ok) throw new Error("Failed to load proofs");
            const data = await response.json();
            setProofs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border-b border-violet-500/30 shadow-xl shadow-violet-900/20">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                        💳 Payment Proof
                    </h1>
                    <p className="text-gray-400 text-lg">
                        View our verified payment proofs from satisfied players
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center items-center min-h-96">
                        <div className="text-gray-400 text-lg">Loading payment proofs...</div>
                    </div>
                ) : proofs.length === 0 ? (
                    <div className="text-center min-h-96 flex items-center justify-center">
                        <div className="text-gray-400 text-lg">
                            No payment proofs available at the moment
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-8">
                            <p className="text-gray-300 text-center max-w-2xl mx-auto">
                                All payment proofs below are from real transactions with our players.
                                Click on any image to view it in full size.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {proofs.map((proof) => (
                                <div
                                    key={proof._id}
                                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-violet-500/30 hover:border-violet-500/60 transition-all hover:shadow-lg hover:shadow-violet-500/20 group"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={proof.imageUrl}
                                            alt={proof.title || "Payment Proof"}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <button
                                            onClick={() => setSelectedProof(proof)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all"
                                        >
                                            <div className="bg-amber-500/80 hover:bg-amber-600 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                                                <Eye size={24} />
                                            </div>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        {proof.title && (
                                            <h3 className="font-bold text-white mb-2">
                                                {proof.title}
                                            </h3>
                                        )}
                                        {proof.description && (
                                            <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                                                {proof.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            📅 {new Date(proof.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {selectedProof && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-xl overflow-hidden max-w-2xl w-full border border-violet-500/30 shadow-2xl shadow-violet-900/50">
                        <div className="flex items-center justify-between p-4 border-b border-violet-500/30">
                            <h3 className="text-lg font-bold text-white">
                                {selectedProof.title || "Payment Proof"}
                            </h3>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <img
                            src={selectedProof.imageUrl}
                            alt={selectedProof.title || "Payment Proof"}
                            className="w-full max-h-96 object-contain"
                        />
                        {selectedProof.description && (
                            <div className="p-4 border-t border-violet-500/30 bg-slate-800/50">
                                <p className="text-gray-300 leading-relaxed">
                                    {selectedProof.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentProofsPage;
