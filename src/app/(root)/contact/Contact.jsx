"use client";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import React from "react";

const Contact = ({ setting }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col justify-center items-center">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-amber-300 to-yellow-300 rounded-lg p-5 mb-6 w-full text-center shadow-lg shadow-amber-200/50">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            <Typewriter
              words={["ईमानदारी ही हमारी पहचान है।"]}
              cursor
              cursorBlinking={false}
              cursorStyle=""
              typeSpeed={80}
            />
          </h1>
        </div>

        {/* Site Name */}
        <div className="bg-amber-500 rounded-lg w-full text-center py-6 mb-6">
          <h2 className="text-3xl lg:text-4xl text-white font-bold">
            Satta Disawer Satta
          </h2>
        </div>

        {/* Contact Section */}
        <div className="bg-amber-100 border border-amber-200 rounded-lg p-6 w-full text-center shadow-sm shadow-amber-200/40">
          <p className="text-slate-700 mb-4 hindi-text">
            Game play करने के लिये नीचे लिंक पर क्लिक करे
          </p>
          <Link
            target="_blank"
            href={`https://wa.me/+${setting?.whatsappNumber}`}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            WhatsApp पर संपर्क करें
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
