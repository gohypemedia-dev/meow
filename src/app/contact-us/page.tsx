"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";

export default function ContactUsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const email = "Meowganics@gmail.com";
  const phone = "+91 98639 07908";
  const cleanPhone = "919863907908";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#111317] text-white flex flex-col justify-between selection:bg-[#A9D3F4] selection:text-black">
      {/* Header */}
      <header className="relative z-30 px-4 sm:px-8 md:px-12 py-4 flex items-center justify-between border-b border-white/10 bg-[#111317]">
        <Link href="/" className="flex items-center group">
          <Image
            src="/meowganics_logo_transparent.png"
            alt="MeowGanics Logo"
            width={1776}
            height={725}
            className="w-auto h-10 sm:h-12 object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-heading font-medium bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15"
          >
            <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Store</span>
          </Link>
          <ProfileMenu theme="frameless" iconClassName="w-6 h-6 text-white" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8">
          Have questions about Clean Bean Tofu Cat Litter, your order, or subscriptions? Reach out to us directly through email, phone, or WhatsApp.
        </p>

        {/* Contact Methods */}
        <div className="space-y-4 mb-8">
          {/* Email */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-xs font-mono uppercase text-white/50 mb-1">
                Email
              </span>
              <a
                href={`mailto:${email}`}
                className="text-lg sm:text-xl font-heading font-bold text-white hover:text-[#A9D3F4] transition-colors"
              >
                {email}
              </a>
              <p className="text-xs text-white/50 mt-1">
                We typically respond within a few hours.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-heading font-bold hover:bg-white/90 transition-all"
              >
                Send Email
              </a>
              <button
                onClick={() => handleCopy(email, "email")}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-heading font-medium border border-white/10 transition-all cursor-pointer"
              >
                {copied === "email" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-xs font-mono uppercase text-white/50 mb-1">
                Phone & WhatsApp
              </span>
              <a
                href={`tel:${phone}`}
                className="text-lg sm:text-xl font-heading font-bold text-white hover:text-[#A9D3F4] transition-colors"
              >
                {phone}
              </a>
              <p className="text-xs text-white/50 mt-1">
                Call us or chat with our team on WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] text-black text-xs font-heading font-bold hover:opacity-90 transition-all"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${phone}`}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-heading font-medium border border-white/10 transition-all"
              >
                Call
              </a>
              <button
                onClick={() => handleCopy(phone, "phone")}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-heading font-medium border border-white/10 transition-all cursor-pointer"
              >
                {copied === "phone" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Operating Hours / Note */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-sm text-white/70 space-y-2">
          <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
            Customer Support Hours
          </h2>
          <p className="text-xs sm:text-sm">
            Monday through Saturday: 9:00 AM – 7:00 PM IST
          </p>
          <p className="text-xs text-white/50 pt-2 border-t border-white/10">
            For returns or refunds, please reach out via email with your order number.
          </p>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-8 text-center text-xs text-white/50">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-3">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/return-and-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link>
          <span>•</span>
          <Link href="/contact-us" className="text-white font-medium">Contact Us</Link>
        </div>
        <p>© {new Date().getFullYear()} MeowGanics. All rights reserved.</p>
      </footer>
    </div>
  );
}
