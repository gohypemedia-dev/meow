import React from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Privacy Policy | MeowGanics",
  description: "Learn how MeowGanics handles and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#111317] text-white flex flex-col justify-between selection:bg-[#A9D3F4] selection:text-black">
      {/* Header - Matching Home Page Logo & Nav Controls */}
      <PageHeader />

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm font-mono text-white/50 mb-8">
          Last updated: November 2026
        </p>

        <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
          This Privacy Policy explains how MeowGanics collects, uses, and protects your information when you visit our website or make a purchase.
        </p>

        <div className="space-y-8 text-sm sm:text-base text-white/80 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Information We Collect
            </h2>
            <p className="text-white/70">
              When you purchase from MeowGanics or create an account, we collect the necessary information to complete your orders:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/70 ml-2">
              <li>Name, email address, phone number, shipping address, and billing address.</li>
              <li>Order details, such as selected litter scents, bag quantities, and subscription preferences.</li>
              <li>Basic device and browser information to ensure secure checkout and detect fraudulent transactions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              How We Use Your Information
            </h2>
            <p className="text-white/70">
              We use your personal data to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/70 ml-2">
              <li>Process and fulfill orders, including shipping notifications and tracking updates.</li>
              <li>Handle customer support inquiries and process return or refund requests.</li>
              <li>Maintain subscription renewal cycles chosen by the customer.</li>
              <li>Communicate order status updates and occasional product announcements (opt-out anytime).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Shopify & Third-Party Service Providers
            </h2>
            <p className="text-white/70">
              We do not sell your personal data. We share only necessary details with trusted partners:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/70 ml-2">
              <li><strong className="text-white">Shopify:</strong> Powers our online storefront, catalog, and cart infrastructure under strict security and privacy standards.</li>
              <li><strong className="text-white">Payment Gateways:</strong> Payment transactions are handled directly through encrypted payment providers. We do not store raw credit card numbers.</li>
              <li><strong className="text-white">Shipping Couriers:</strong> Delivery services receive only your address and contact details to deliver your order.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Data Security & Retention
            </h2>
            <p className="text-white/70">
              We employ standard encryption and security protocols to safeguard your information. We retain order records only as long as necessary for tax, accounting, and legal compliance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              Your Rights & Contact
            </h2>
            <p className="text-white/70">
              You may request access to, correction of, or deletion of your personal data at any time. For questions regarding your privacy, contact us at:
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
          <Link href="/privacy-policy" className="text-white font-medium">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
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
