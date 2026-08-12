import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import Image from "next/image";

const COMPLAINT_NUMBER = "91 94991 94846";
const DISPLAY_NUMBER = "+91 94991 94846";

const Contact = () => {
  const message = encodeURIComponent(
    "नमस्ते, मुझे भुगतान या किसी अन्य समस्या के संबंध में शिकायत दर्ज करनी है।",
  );

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section
        aria-labelledby="complaint-heading"
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-violet-400/25 bg-slate-900/90 px-5 py-10 text-center shadow-2xl shadow-violet-950/40 backdrop-blur-sm sm:px-12 sm:py-14"
      >
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10 sm:h-24 sm:w-24">
          <Image
            className="max-sm:!size-14 relative z-10"
            width={70}
            height={70}
            src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
            alt="whatsapp"
          />
        </div>

        <h1
          id="complaint-heading"
          className="hindi-text text-3xl font-black text-white sm:text-4xl"
        >
          शिकायत
        </h1>

        <p className="hindi-text mx-auto mt-6 max-w-2xl text-lg font-medium leading-9 text-slate-200 sm:text-2xl sm:leading-10">
          यदि किसी खाईवाल ने आपका भुगतान नहीं किया है या आपको किसी अन्य समस्या
          का सामना करना पड़ रहा है, तो कृपया नीचे दिए गए WhatsApp नंबर पर तुरंत
          हमसे संपर्क करें।
        </p>

        <Link
          href={`https://wa.me/${COMPLAINT_NUMBER}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp पर शिकायत करें: ${DISPLAY_NUMBER}`}
          className="hindi-text mx-auto mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-green-600 px-7 py-4 text-lg font-bold text-white shadow-lg shadow-green-950/30 transition-colors duration-200 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300/60 active:bg-green-700 sm:px-10 sm:text-xl"
        >
          <Image
            className="max-sm:!size-14 relative z-10"
            width={70}
            height={70}
            src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
            alt="whatsapp"
          />
          WhatsApp पर शिकायत करें
        </Link>

        <Link
          href={`tel:+${COMPLAINT_NUMBER}`}
          aria-label={`फोन करें: ${DISPLAY_NUMBER}`}
          className="mt-7 flex min-h-12 items-center justify-center gap-2 text-xl font-black tracking-wide text-green-400 transition-colors duration-200 hover:text-green-300 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 sm:text-2xl"
        >
          <Phone aria-hidden="true" className="h-5 w-5" />
          {DISPLAY_NUMBER}
        </Link>
      </section>
    </main>
  );
};

export default Contact;
