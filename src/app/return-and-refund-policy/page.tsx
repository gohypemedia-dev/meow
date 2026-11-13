import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Return & Refund Policy | MeowGanics",
  description: "30-Day Happiness Guarantee. Simple returns and refund details.",
};

export default function ReturnAndRefundPolicyPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#111317] text-white flex flex-col justify-between selection:bg-[#A9D3F4] selection:text-black">
      {/* Header - Matching Home Page Logo & Nav Controls */}
      <PageHeader />

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mb-2">
          Return & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm font-mono text-white/50 mb-8">
          Last updated: November 2026
        </p>

        <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
          We want you and your cat to have a great experience with Clean Bean. If you are not satisfied with your purchase, here is how our returns and refunds work.
        </p>

        <div className="space-y-8 text-sm sm:text-base text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              30-Day Satisfaction Guarantee
            </h2>
            <p className="text-white/70">
              For first-time orders of Clean Bean Tofu Cat Litter:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/70 ml-2">
              <li>If you or your cat are not satisfied with the litter within 30 days of delivery, contact us for a full product refund.</li>
              <li>You do not need to ship back opened or used bags of cat litter.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Unopened Bags & Accessories
            </h2>
            <p className="text-white/70">
              For unopened bags, multi-packs (12L, 18L), and accessories:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/70 ml-2">
              <li>Items must be in original, unopened, and sealed condition.</li>
              <li>Return requests must be initiated within 30 days of delivery.</li>
              <li>Refunds are issued to your original payment method once the return is received.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Damaged or Defective Items
            </h2>
            <p className="text-white/70">
              If your package arrives damaged by shipping or has any manufacturing defect, please contact us with a photo of the package and your order number. We will send a free replacement immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              How to Request a Refund
            </h2>
            <p className="text-white/70">
              To request a return or refund, simply reach out to us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white/80 space-y-1">
              <p>Email: <a href="mailto:Meowganics@gmail.com" className="text-[#A9D3F4] hover:underline">Meowganics@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+919863907908" className="text-[#A9D3F4] hover:underline">+91 98639 07908</a></p>
              <p className="text-white/50 pt-1 text-xs">Please include your order number and the item you would like to return.</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-8 text-center text-xs text-white/50">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-3">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/return-and-refund-policy" className="text-white font-medium">Return & Refund Policy</Link>
          <span>•</span>
          <Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
        <p>© {new Date().getFullYear()} MeowGanics. All rights reserved.</p>
      </footer>
    </div>
  );
}
