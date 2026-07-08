"use client";

const SimpleFAQ = () => {
    const faqItems = [
        {
            id: 1,
            q_en: "What is Satta Disawer?",
            q_hi: "सट्टा दिसावर क्या है?",
            a_en: "Satta Disawer is a type of lottery or betting game. Players predict numbers and place bets on different satta markets.",
            a_hi: "सट्टा दिसावर एक प्रकार की लॉटरी या सट्टेबाजी का खेल है। खिलाड़ी संख्याओं का अनुमान लगाते हैं और विभिन्न सट्टा बाजारों पर दांव लगाते हैं।",
        },
        {
            id: 2,
            q_en: "How can I check today's result?",
            q_hi: "आज के परिणाम की जांच कैसे करें?",
            a_en: "You can check results on our home page or results section. Results update regularly as markets announce them.",
            a_hi: "आप हमारे होम पेज या परिणाम अनुभाग पर परिणाम जांच सकते हैं। बाजारों द्वारा घोषणा के अनुसार परिणाम नियमित रूप से अपडेट होते हैं।",
        },
        {
            id: 3,
            q_en: "What markets are available?",
            q_hi: "कौन से बाजार उपलब्ध हैं?",
            a_en: "We provide results for Shirdi Dham, Kaliyar, Delhi Bazar, Shri Ganesh, Faridabad, Shaktipeeth, Ghaziabad, Mathura, Gali, and Disawer.",
            a_hi: "हम शिव धाम, कालियार, दिल्ली बाजार, श्री गणेश, फरीदाबाद, शक्तिपीठ, गाजियाबाद, मथुरा, गली और देसावर के लिए परिणाम प्रदान करते हैं।",
        },
        {
            id: 4,
            q_en: "What are record charts?",
            q_hi: "रिकॉर्ड चार्ट क्या हैं?",
            a_en: "Record charts display historical results from previous days, weeks, or months, helping you analyze past numbers and trends.",
            a_hi: "रिकॉर्ड चार्ट पिछले दिनों, हफ्तों, या महीनों से ऐतिहासिक परिणाम प्रदर्शित करते हैं, जो आपको पिछली संख्याओं और प्रवृत्तियों का विश्लेषण करने में मदद करते हैं।",
        },
        {
            id: 5,
            q_en: "Can numbers be predicted?",
            q_hi: "क्या संख्याओं की भविष्यवाणी की जा सकती है?",
            a_en: "Some people analyze past patterns, but results are random. No prediction method is guaranteed to be correct.",
            a_hi: "कुछ लोग पिछले पैटर्न का विश्लेषण करते हैं, लेकिन परिणाम यादृच्छिक हैं। कोई भी भविष्यवाणी पद्धति सही होने की गारंटी नहीं दे सकती।",
        },
        {
            id: 6,
            q_en: "What payment methods are accepted?",
            q_hi: "कौन से भुगतान तरीके स्वीकार किए जाते हैं?",
            a_en: "We accept PAYTM, Bank Transfer, Phone Pay, Google Pay, and other digital payment options.",
            a_hi: "हम पेटीएम, बैंक ट्रांसफर, फोन पे, गूगल पे और अन्य डिजिटल भुगतान विकल्पों को स्वीकार करते हैं।",
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
                                <span>{item.q_en}</span>
                            </h3>
                            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-start gap-2 ml-7">
                                <span>{item.q_hi}</span>
                            </h3>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3">{item.a_en}</p>
                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{item.a_hi}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimpleFAQ;
