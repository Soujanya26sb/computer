"use client";

import { useState } from "react";

const FAQS = [
  {
    category: "Ordering",
    items: [
      ["How do I place an order?", "Browse our product catalog, find what you need, click 'Order Enquiry' on the product page, fill in your name, email and phone number, then submit. Our team will contact you within a few hours to confirm availability and finalize the order."],
      ["Is online payment available?", "No. We do not process online payments on this website. All orders are confirmed by phone or email, and payment is made in-store or via bank transfer after confirmation."],
      ["Can I order multiple items?", "Yes! You can submit separate enquiries for each product, or mention all items in the notes field of your enquiry. Our team will consolidate your order."],
      ["How long does it take to confirm an order?", "We typically respond within 2–4 hours during business hours (Mon–Sat, 9am–7pm). For urgent orders, please call us directly."],
    ],
  },
  {
    category: "Products",
    items: [
      ["Are all products genuine?", "Yes, 100%. All products are sourced directly from authorized distributors and carry full manufacturer warranty. We do not sell refurbished or counterfeit products."],
      ["Can I check product compatibility?", "Absolutely. Call or email us before ordering and our tech team will verify compatibility with your existing setup — especially for components like RAM, GPUs and storage."],
      ["Do you have products not listed on the website?", "Sometimes. Our catalog is updated regularly, but we may have additional stock. Contact us with your specific requirements and we'll check availability."],
      ["What brands do you carry?", "We stock products from Intel, AMD, NVIDIA, Dell, HP, Lenovo, ASUS, Samsung, Seagate, Corsair, Kingston, Western Digital and many more."],
    ],
  },
  {
    category: "Warranty & Support",
    items: [
      ["What warranty do products come with?", "All products carry the standard manufacturer warranty (typically 1–3 years depending on the product). We assist with warranty claims and repairs."],
      ["What if I receive a defective product?", "Contact us immediately. We will arrange a replacement or repair as per the manufacturer's warranty policy. Customer satisfaction is our priority."],
      ["Do you offer installation or setup services?", "Yes, for local customers we can assist with PC assembly, OS installation and basic setup. Contact us for details and pricing."],
    ],
  },
  {
    category: "Store & Delivery",
    items: [
      ["Can I visit the store?", "Yes! Walk-ins are welcome during business hours. Our staff will be happy to demonstrate products and help you make the right choice."],
      ["Do you offer delivery?", "Delivery options depend on your location. Contact us to discuss delivery arrangements and any associated costs."],
      ["What are your business hours?", "We are open Monday to Saturday, 9:00 AM to 7:00 PM. We are closed on Sundays and public holidays."],
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="bg-[#f1f3f6]">
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200 mb-3">FAQ</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-3 text-sm text-blue-200">Everything you need to know before buying.</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-black text-gray-900 mb-4 section-header">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map(([q, a]) => {
                const key = `${section.category}-${q}`;
                const isOpen = openItem === key;
                return (
                  <div key={q} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenItem(isOpen ? null : key)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="font-black text-gray-900 text-sm pr-4">{q}</span>
                      <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 transition-transform ${isOpen ? "rotate-45 border-[#2874f0] text-[#2874f0]" : ""}`}>
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 slide-down">
                        <p className="text-sm leading-7 text-gray-600">{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2874f0] to-[#0d47a1] p-8 text-white text-center">
          <h2 className="text-xl font-black mb-2">Still Have Questions?</h2>
          <p className="text-sm text-blue-200 mb-5">Our team is ready to help you with any queries about products, orders or compatibility.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/contact" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-[#2874f0] hover:bg-blue-50 transition">
              Contact Us
            </a>
            <a href="/products" className="rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition">
              Browse Products
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
