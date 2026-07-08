"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQPage = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqItems = [
        {
            id: 1,
            question: "What is Satta Disawer?",
            answer:
                "Satta Disawer is a type of lottery or betting game that is played in India. Players predict numbers and place bets on different satta markets. The winning number is announced at a specific time each day.",
        },
        {
            id: 2,
            question: "How can I check today's Satta Disawer result?",
            answer:
                "You can check today's results on our website by visiting the home page or results section. Results are updated regularly as they are announced by different markets. You can also check specific market results from the chart section.",
        },
        {
            id: 3,
            question: "What satta markets are available on this website?",
            answer:
                "We provide results and charts for many popular markets including Shiv Dham, Pushkar Bazar, Delhi Metro, Delhi Bazar, Shri Sayam, Shri Ganesh, Kolmbia, Faridabad, Makka-Madina, Ghaziabad, Kalka Night, Gali, and Desawer. Each market has its own declaration time during the day.",
        },
        {
            id: 4,
            question: "What are Satta Disawer record charts?",
            answer:
                "Satta record charts display historical results from previous days, weeks, months, or even years. These charts help players analyze past numbers and trends. You can view detailed charts for each market to understand the history of numbers drawn.",
        },
        {
            id: 5,
            question: "Can satta numbers be predicted?",
            answer:
                "Some people try to analyze old charts and patterns to predict numbers, but satta results are random. No prediction method can guarantee accurate results. The outcome depends on chance, and predictions are never guaranteed to be correct.",
        },
        {
            id: 6,
            question: "Which Satta Disawer number is most likely to win?",
            answer:
                "There is no specific number that is more likely to win because results are completely random. Any number between 00 and 99 has an equal chance of being declared as the winning number in any draw.",
        },
        {
            id: 7,
            question: "How do I place a bet in Satta Disawer?",
            answer:
                "To place a bet, you need to contact our authorized agents or representatives. They will help you place your bet on your chosen market and number. Payment can be made through various methods including PAYTM, Bank Transfer, Phone Pay, and Google Pay.",
        },
        {
            id: 8,
            question: "What payment methods are accepted?",
            answer:
                "We accept multiple payment methods including PAYTM, Bank Transfer, Phone Pay, Google Pay, and other digital payment options. All transactions are secure and verified. For payment details, contact our support team.",
        },
        {
            id: 9,
            question: "Are winning payments guaranteed?",
            answer:
                "Yes, all winning payments are guaranteed and processed quickly. We maintain a 100% payment guarantee policy. Winners can verify payment proofs on our website, and all transactions are documented.",
        },
        {
            id: 10,
            question: "Is Satta Disawer legal?",
            answer:
                "Satta Disawer and related betting activities may be illegal in some regions of India. This website is purely informational and for entertainment purposes only. Users are responsible for complying with local laws and regulations in their area. Always check your local laws before participating.",
        },
    ];

    const toggleFAQ = (id) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border-b border-violet-500/30 shadow-xl shadow-violet-900/20">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                        ❓ Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Find answers to common questions about Satta Disawer and our services
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    {faqItems.map((item) => {
                        const isOpen = openFAQ === item.id;
                        return (
                            <div
                                key={item.id}
                                className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl border border-violet-500/30 overflow-hidden hover:border-violet-500/60 transition-all"
                            >
                                <button
                                    onClick={() => toggleFAQ(item.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-violet-500/10 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-white text-left flex items-center gap-3">
                                        <span className="text-amber-400 font-black">
                                            {item.id}.
                                        </span>
                                        {item.question}
                                    </h3>
                                    <ChevronDown
                                        size={24}
                                        className={`text-amber-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-6 py-4 border-t border-violet-500/30 bg-slate-800/50">
                                        <p className="text-gray-300 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-gradient-to-br from-amber-500/10 to-violet-500/10 rounded-xl border border-violet-500/30 p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Need More Help?
                    </h2>
                    <p className="text-gray-300 mb-4">
                        If you couldn&apos;t find the answer to your question, please feel free to contact us. Our support team is here to help you 24/7.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/40 transition-all"
                        >
                            Contact Us
                        </Link>
                        <a
                            href="https://wa.me/918950312367"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/40 transition-all"
                        >
                            WhatsApp Support
                        </a>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 bg-red-500/10 rounded-xl border border-red-500/30 p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Disclaimer</h3>
                    <p className="text-gray-300 text-sm">
                        Satta Disawer and related activities may be illegal in some regions. This website is for informational and entertainment purposes only and does not promote or support gambling. Users are responsible for how they use the information provided and must comply with local laws and regulations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
