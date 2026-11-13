import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Terms & Conditions | MeowGanics",
  description: "Terms and conditions governing orders and use of the MeowGanics store.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#111317] text-white flex flex-col justify-between selection:bg-[#A9D3F4] selection:text-black">
      {/* Header - Matching Home Page Logo & Nav Controls */}
      <PageHeader />

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm font-mono text-white/50 mb-8">
          Last updated: November 2026
        </p>

        <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
          By visiting our site or purchasing products from MeowGanics, you agree to the following terms and conditions.
        </p>

        <div className="space-y-8 text-sm sm:text-base text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              General Conditions
            </h2>
            <p className="text-white/70">
              We reserve the right to refuse service to anyone for any legitimate reason at any time. You agree not to reproduce, duplicate, copy, or exploit any portion of the service or product assets without written permission from MeowGanics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Products and Pricing
            </h2>
            <p className="text-white/70">
              Prices for our products (including Clean Bean litter bags and accessories) are subject to change without notice. We reserve the right to modify or discontinue products at any time. We make every effort to display accurate descriptions, bag sizes, and scent details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Accuracy of Billing and Account Information
            </h2>
            <p className="text-white/70">
              You agree to provide current, complete, and accurate purchase and shipping information for all orders placed through our store. If an order cannot be processed or if an address error occurs, we will attempt to reach you via email or phone.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Subscription Orders
            </h2>
            <p className="text-white/70">
              If you enroll in an automatic litter subscription, recurring charges will occur based on your selected delivery frequency. You can modify or cancel your subscription at any time before your scheduled renewal date by contacting us or managing your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Questions & Contact
            </h2>
            <p className="text-white/70">
              For any questions regarding these Terms & Conditions, please reach out to us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white/80 space-y-1">
              <p>Email: <a href="mailto:Meowganics@gmail.com" className="text-[#A9D3F4] hover:underline">Meowganics@gmail.com</a></p>
              <p>Phone: <a href="tel:+919863907908" className="text-[#A9D3F4] hover:underline">+91 98639 07908</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-8 text-center text-xs text-white/50">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-3">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms-and-conditions" className="text-white font-medium">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/return-and-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link>
          <span>•</span>
          <Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
        <p>© {new Date().getFullYear()} MeowGanics. All rights reserved.</p>
      </footer>
    </div>
  );
}
