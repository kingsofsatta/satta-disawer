"use client";
import { useState, useEffect } from "react";
import { Upload, Trash2, Eye, X, AlertCircle } from "lucide-react";

const PaymentProofSection = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedProof, setSelectedProof] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        file: null,
        title: "",
        description: "",
    });

    useEffect(() => {
        loadPaymentProofs();
    }, []);

    const loadPaymentProofs = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch("/api/payments");
            if (!response.ok) throw new Error("Failed to load payment proofs");
            const data = await response.json();
            setProofs(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            setFormData({ ...formData, file });
            setError("");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!formData.file) {
            setError("Please select a file");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const uploadFormData = new FormData();
            uploadFormData.append("file", formData.file);
            uploadFormData.append("title", formData.title);
            uploadFormData.append("description", formData.description);

            const response = await fetch("/api/payments", {
                method: "POST",
                body: uploadFormData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Upload failed");
            }

            const newProof = await response.json();
            setProofs([newProof, ...proofs]);
            setFormData({ file: null, title: "", description: "" });
            setShowUploadModal(false);
            alert("Payment proof uploaded successfully!");
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this payment proof?")) return;

        try {
            setError("");
            const response = await fetch(`/api/payments/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete");
            setProofs(proofs.filter((p) => p._id !== id));
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleToggleActive = async (id, isActive) => {
        try {
            setError("");
            const response = await fetch(`/api/payments/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !isActive }),
            });

            if (!response.ok) throw new Error("Failed to update");
            const updated = await response.json();
            setProofs(proofs.map((p) => (p._id === id ? updated : p)));
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 rounded-xl p-6 border border-violet-500/30">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    💳 Payment Proof Management
                </h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/40 transition-all"
                >
                    <Upload size={20} />
                    Upload Proof
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-200">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-xl p-8 max-w-md w-full border border-violet-500/30">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Upload Payment Proof
                            </h3>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setFormData({ file: null, title: "", description: "" });
                                    setError("");
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-amber-400 mb-2">
                                    Image File (Max 5MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 bg-slate-800 border border-violet-500/50 rounded-lg text-white"
                                />
                                {formData.file && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        Selected: {formData.file.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-amber-400 mb-2">
                                    Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="e.g., Bank Transfer Proof"
                                    className="w-full px-4 py-2 bg-slate-800 border border-violet-500/50 rounded-lg text-white placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-amber-400 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Add any details about this proof..."
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-800 border border-violet-500/50 rounded-lg text-white placeholder-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-2.5 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/40 transition-all disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Proofs Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-400">Loading payment proofs...</div>
                </div>
            ) : proofs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    No payment proofs uploaded yet
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {proofs.map((proof) => (
                        <div key={proof._id} className="bg-slate-800/50 rounded-lg overflow-hidden border border-violet-500/20 hover:border-violet-500/50 transition-all">
                            <div className="relative">
                                <img
                                    src={proof.imageUrl}
                                    alt={proof.title || "Payment Proof"}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => setSelectedProof(proof)}
                                        className="bg-blue-500/80 hover:bg-blue-600 p-2 rounded text-white"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(proof._id)}
                                        className="bg-red-500/80 hover:bg-red-600 p-2 rounded text-white"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <button
                                        onClick={() =>
                                            handleToggleActive(proof._id, proof.isActive)
                                        }
                                        className={`px-3 py-1 rounded text-xs font-bold ${proof.isActive
                                                ? "bg-green-500/80 text-white"
                                                : "bg-gray-500/80 text-white"
                                            }`}
                                    >
                                        {proof.isActive ? "Active" : "Hidden"}
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                {proof.title && (
                                    <h4 className="font-bold text-white text-sm mb-1">
                                        {proof.title}
                                    </h4>
                                )}
                                {proof.description && (
                                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                        {proof.description}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {new Date(proof.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Preview Modal */}
            {selectedProof && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-xl overflow-hidden max-w-2xl w-full border border-violet-500/30">
                        <div className="flex items-center justify-between p-4 border-b border-violet-500/30">
                            <h3 className="text-lg font-bold text-white">
                                {selectedProof.title || "Payment Proof"}
                            </h3>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <img
                            src={selectedProof.imageUrl}
                            alt={selectedProof.title || "Payment Proof"}
                            className="w-full max-h-96 object-contain"
                        />
                        {selectedProof.description && (
                            <div className="p-4 border-t border-violet-500/30">
                                <p className="text-gray-300">{selectedProof.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentProofSection;
