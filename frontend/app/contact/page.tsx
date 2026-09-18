const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "TechZone";
const PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "";
const EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
const ADDRESS = process.env.NEXT_PUBLIC_SHOP_ADDRESS || "";
const WHATSAPP = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "";

export default function ContactPage() {
  return (
    <div className="bg-[#f1f3f6]">
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200 mb-3">Contact Us</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Get in Touch with {SHOP_NAME}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
            Have questions about a product? Want to check availability? Need help choosing the right laptop or desktop? We&apos;re here to help.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Contact cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "📞",
              title: "Call Us",
              value: PHONE || "Not configured",
              href: PHONE ? `tel:${PHONE}` : "",
              desc: "Mon–Sat, 9am–7pm",
              color: "border-[#2874f0]",
            },
            {
              icon: "✉️",
              title: "Email Us",
              value: EMAIL || "Not configured",
              href: EMAIL ? `mailto:${EMAIL}` : "",
              desc: "We reply within 24 hours",
              color: "border-green-500",
            },
            {
              icon: "💬",
              title: "WhatsApp",
              value: WHATSAPP || "Not configured",
              href: WHATSAPP ? `https://wa.me/${WHATSAPP.replace(/\D/g, "")}` : "",
              desc: "Quick responses",
              color: "border-[#25d366]",
            },
            {
              icon: "📍",
              title: "Visit Us",
              value: ADDRESS || "Address not configured",
              href: "",
              desc: "Walk-in welcome",
              color: "border-orange-500",
            },
          ].map((item) => (
            <div key={item.title} className={`rounded-2xl border-t-4 ${item.color} border border-gray-200 bg-white p-6 shadow-sm`}>
              <span className="text-3xl">{item.icon}</span>
              <p className="mt-3 text-xs font-black uppercase tracking-wider text-gray-500">{item.title}</p>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith("https") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-2 block text-base font-black text-gray-900 hover:text-[#2874f0] transition break-words">
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 text-base font-black text-gray-900 break-words">{item.value}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#2874f0] mb-2">Before You Contact</p>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Common Questions</h2>
              <div className="space-y-3">
                {[
                  ["How do I place an order?", "Browse products, click 'Order Enquiry', fill your details, then we confirm by phone or email."],
                  ["Do you accept online payment?", "No. We confirm orders by phone or email and payment is done in-store or via bank transfer."],
                  ["Can I visit the store?", "Yes! Walk-ins are welcome during business hours. Call ahead for large orders."],
                  ["Do you offer warranty?", "Yes, all products come with manufacturer warranty. We assist with claims."],
                ].map(([q, a]) => (
                  <details key={q} className="rounded-xl border border-gray-200 p-4">
                    <summary className="cursor-pointer font-black text-gray-900 text-sm">{q}</summary>
                    <p className="mt-2 text-sm text-gray-600 leading-5">{a}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#2874f0] to-[#0d47a1] p-8 text-white text-center">
              <span className="text-5xl">🤝</span>
              <h3 className="mt-4 text-xl font-black">We&apos;re Here to Help</h3>
              <p className="mt-2 text-sm text-blue-200 leading-6">
                Our team of computer experts is ready to help you find the perfect product for your budget and requirements.
              </p>
              {PHONE && (
                <a href={`tel:${PHONE}`} className="mt-5 inline-block rounded-lg bg-white px-6 py-3 text-sm font-black text-[#2874f0] hover:bg-blue-50 transition">
                  📞 Call Now
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
