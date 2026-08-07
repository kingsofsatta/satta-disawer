import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Satta Disawer",
  description: "Terms of Service for SattaDisawer.com - Read our legal terms, user agreements, and service disclaimers.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0f0c29] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-300">
            Website:{" "}
            <Link 
              href="https://www.sattadisawer.com/" 
              className="text-violet-400 hover:text-violet-300 underline"
            >
              https://www.sattadisawer.com/
            </Link>
          </p>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 space-y-8 border border-slate-700">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement made between you (&quot;the User&quot;) and the owners and operators of <strong>Satta king Disawer.com</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of our website and services. By accessing or using <strong>SattaDisawer.com</strong>, you confirm that you have read, understood, and agreed to be bound by all of these Terms. If you do not agree with all of these Terms, you are expressly prohibited from using the website and must discontinue use immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              2. Description of Services & Disclaimer
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong>SattaDisawer.com</strong> operates as an independent news publishing, informational archive, and result display platform. The primary services provided include:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 pl-4">
              <li>
                <strong>Information & Data Publishing:</strong> Aggregating, organizing, and presenting publicly available daily Matka and Satta market numbers (including Disawer, Gali, Faridabad, Ghaziabad, Shri Ganesh, Delhi Bazar, Shirdi Dham, Kaliyar, Shakti Peeth, Mathura, Kalyan, Milan, and Rajdhani) for historical reference and public information.
              </li>
              <li>
                <strong>AI & Arithmetic Display Model:</strong> All numbers and daily estimates displayed on this platform are derived from public internet sources, basic arithmetic patterns, AI algorithms, and zodiac sign/astrological references.
              </li>
              <li>
                <strong>No Gambling Connection:</strong> <strong>Satta Disawer</strong> has no connection, association, or affiliation of any kind with any gambling establishment, betting entity, or illegal activity such as money laundering.
              </li>
              <li>
                <strong>Ad-Supported & Free Service:</strong> The platform is provided entirely free of charge and relies on Google Ad revenue and public informational media. We do not process direct gambling bets or accept financial deposits on this website.
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              3. User Eligibility & Compliance with Local Laws
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Services are intended strictly for users who have reached the legal age of majority in their applicable jurisdiction.
            </p>
            <ul className="list-disc list-inside space-y-3 text-slate-300 pl-4">
              <li>
                <strong>Legal Responsibility:</strong> Gambling and betting activities may be regulated, restricted, or illegal under specific state, national, or local laws. It is your sole responsibility to comply with the laws applicable in your jurisdiction.
              </li>
              <li>
                <strong>Informational Use Only:</strong> Users must not rely on the numbers, charts, or guessing trends provided on <strong>Satta Disawer</strong> as guaranteed financial, investment, or legal advice. Past draw charts and trend predictions do not guarantee future outcomes.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              4. Third-Party Links & External Khaiwal Contacts
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong>SattaDisawer.com</strong> may display contact details, referral links, or buttons directing users to third-party communication channels (such as Telegram, or third-party payment providers including Paytm, PhonePe, Google Pay, and Bank Transfer).
            </p>
            <ul className="list-disc list-inside space-y-3 text-slate-300 pl-4">
              <li>
                We do not operate, control, or take responsibility for third-party websites, apps, or external contacts (such as Khaiwal handlers or group channels).
              </li>
              <li>
                Any interactions, transactions, or communications you engage in with external third parties are conducted entirely at your own risk.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              5. Intellectual Property Rights
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Unless otherwise indicated, the website design, text, logos, layout, charts, code, and content on <strong>SattaDisawer.com</strong> are our proprietary property or licensed to us, protected by copyright, trademark, and intellectual property laws. Unauthorized reproduction, scraping, or commercial exploitation of the content without express written permission is strictly prohibited.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              6. Prohibited Conduct
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You agree not to use <strong>Disawer Satta</strong> to:
            </p>
            <ul className="list-disc list-inside space-y-3 text-slate-300 pl-4">
              <li>Use automated scripts, bots, or scrapers to extract data from the website without consent.</li>
              <li>Attempt to disrupt, compromise, or interfere with network security or site performance.</li>
              <li>Use the website or its content for any illegal activity under your local laws.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              7. Disclaimers & Limitation of Liability
            </h2>
            <ul className="list-disc list-inside space-y-3 text-slate-300 pl-4">
              <li>
                <strong>&quot;AS IS&quot; Basis:</strong> THE SERVICES AND CONTENT ON SATTADISAWER.COM ARE PROVIDED ON AN &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; BASIS. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ACCURACY, COMPLETENESS, TIMELINESS, OR FITNESS FOR A PARTICULAR PURPOSE.
              </li>
              <li>
                <strong>Limitation of Liability:</strong> IN NO EVENT SHALL SATTADISAWER.COM, ITS OPERATORS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR RELIANCE ON ANY INFORMATION PUBLISHED HEREIN.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              8. Governing Law & Jurisdiction
            </h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable governing laws without regard to conflict of law principles. Any legal dispute or claim arising out of or related to the use of <strong>SattaDisawer.com</strong> shall be subject to the exclusive jurisdiction of the competent courts designated by the website administration.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4">
              9. Revisions & General Terms
            </h2>
            <ul className="list-disc list-inside space-y-3 text-slate-300 pl-4">
              <li>
                <strong>Severability:</strong> If any provision of these Terms is found to be unlawful or unenforceable, that provision shall be deemed severable and shall not affect the validity of remaining provisions.
              </li>
              <li>
                <strong>Updates:</strong> We reserve the right to revise or update these Terms of Service at any time. Continued use of <strong>Satta Disawer</strong> following any posted changes constitutes full acceptance of the revised Terms.
              </li>
            </ul>
          </section>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-violet-500/50"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
