"use client";

const SimpleFAQ = () => {
    const faqItems = [
        {
            id: 1,
            q: "What is Satta King?",
            a: "Satta King is a type of lottery or betting game. Players predict numbers and place bets on different satta markets.",
        },
        {
            id: 2,
            q: "How can I check today's result?",
            a: "You can check results on our home page or results section. Results update regularly as markets announce them.",
        },
        {
            id: 3,
            q: "What markets are available?",
            a: "We provide results for Shiv Dham, Pushkar Bazar, Delhi Metro, Delhi Bazar, Shri Sayam, Shri Ganesh, Kolmbia, Faridabad, Makka-Madina, Ghaziabad, Kalka Night, Gali, and Desawer.",
        },
        {
            id: 4,
            q: "What are record charts?",
            a: "Record charts display historical results from previous days, weeks, or months, helping you analyze past numbers and trends.",
        },
        {
            id: 5,
            q: "Can numbers be predicted?",
            a: "Some people analyze past patterns, but results are random. No prediction method is guaranteed to be correct.",
        },
        {
            id: 6,
            q: "What payment methods are accepted?",
            a: "We accept PAYTM, Bank Transfer, Phone Pay, Google Pay, and other digital payment options.",
        },
    ];

    return (
        <div className="mt-12 px-2 md:px-4">
            <div className="bg-gradient-to-r from-violet-700 to-violet-600 rounded-t-2xl py-5 text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold">
                    ❓ Frequently Asked Questions
                </h2>
            </div>

            <div className="bg-slate-900 rounded-b-2xl shadow-sm border border-slate-700 p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqItems.map((item) => (
                        <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-violet-500/50 transition-colors">
                            <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-start gap-2">
                                <span className="text-lg flex-shrink-0">{item.id}.</span>
                                <span>{item.q}</span>
                            </h3>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                        <p className="text-xs md:text-sm text-red-300">
                            <strong>⚠️ Disclaimer:</strong> Satta activities may be illegal in some regions. This site is for information purposes only. Users are responsible for complying with local laws.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleFAQ;
