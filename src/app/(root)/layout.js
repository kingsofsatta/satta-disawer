import Navbar from "@/components/common/Navbar";
import TopProgressBar from "@/components/TopProgressBar";
import { getSettings } from "@/services/result";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";

export const metadata = {
  title: "Satta Disawer",
  description: "Satta Disawer - Satta Matka Results, Charts, and More",
};

export default async function RootLayout({ children }) {
  const setting = await getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0f0c29]">
      <TopProgressBar />
      <Navbar />
      <main>
        {children}
      </main>

      {/* WhatsApp Button with Glow */}
      <Link
        className="fixed bottom-6 right-6 hover:scale-110 transition-all duration-300 z-50 group"
        target="_blank"
        href={`https://wa.me/+91${setting?.site2_whatsappNumber}`}
      >
        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
        <Image
          className="max-sm:!size-14 relative z-10"
          width={70}
          height={70}
          src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
          alt="whatsapp"
        />
      </Link>

      {/* Footer */}
      <footer className="mt-8 relative overflow-hidden">
        {/* Decorative Top Border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>

        <div className="bg-gradient-to-r from-violet-700 to-violet-600 py-4">
          <p className="text-base sm:text-lg text-center font-bold text-white">
            @{currentYear} Satta Disawer Satta :: All Rights Reserved
          </p>
        </div>

        <div className="bg-slate-900 py-6 relative">
          <div className="max-w-4xl mx-auto px-4">
            {/* English Disclaimer */}
            <p className="text-center text-amber-500 font-bold text-base mb-3">ⓘ Disclaimer:</p>
            <p className="text-center text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              This Is A News Publishing Website. All The Numbers Shown In The Website Are Based On Arithmetic And Artificial Intelligence And Are Displayed On The Basis Of Zodiac Sign. This Website Has No Connection Of Any Kind With Any Gambling Establishment. The Website Has No Connection Whatsoever With Any Illegal Activity Such As Gambling, Money Laundering Or Any Other Activity. This Website Is Completely Depends On Google Ad Revenue, All The Information Which Is Being Displayed On This Website Is Taken From Internet Sources.
            </p>

            <div className="h-px w-full bg-violet-600 my-4"></div>

            {/* Hindi Disclaimer */}
            <p className="text-center text-amber-500 font-bold text-base mb-3 hindi-text">ⓘ अस्वीकरण:</p>
            <p className="text-center text-slate-300 text-xs sm:text-sm leading-relaxed hindi-text">
              यह एक समाचार प्रकाशन वेबसाइट है। वेबसाइट में दिखाए गए सभी नंबर अंकगणित और आर्टिफिशियल इंटेलिजेंस (एआई) पर आधारित हैं और राशि चक्र के आधार पर प्रदर्शित किए गए हैं। इस वेबसाइट का किसी भी जुआ प्रतिष्ठान से किसी भी प्रकार का कोई संबंध नहीं है। वेबसाइट का किसी भी अवैध गतिविधि जैसे जुआ, मनी लॉन्ड्रिंग या किसी अन्य गतिविधि से कोई संबंध नहीं है। यह वेबसाइट पूरी तरह से गूगल ऐड रेवेन्यू पर आश्रित है, इस वेबसाइट पर प्रदर्शित होने वाली सभी जानकारी इंटरनेट स्रोतों से ली गई है।
            </p>
          </div>

          {/* Bottom Decorative */}
          <div className="mt-6 flex justify-center">
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
