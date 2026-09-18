import Link from "next/link";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "TechZone";
const PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "";
const EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
const ADDRESS = process.env.NEXT_PUBLIC_SHOP_ADDRESS || "";

export default function AboutPage() {
  return (
    <div className="bg-[#f1f3f6]">
      {/* Hero */}
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200 mb-3">About Us</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Your Trusted Local Computer Store
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100">
            {SHOP_NAME} is your go-to destination for laptops, desktops, PC components and accessories. We believe in genuine products, expert advice and direct customer support.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary rounded-lg px-6 py-3 text-sm font-black uppercase tracking-wider">
              Browse Products
            </Link>
            <Link href="/contact" className="rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Mission */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#2874f0] mb-3">Our Mission</p>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Making Technology Accessible</h2>
            <p className="text-sm leading-7 text-gray-600">
              We started {SHOP_NAME} with a simple goal: make it easy for everyone — from students to professionals — to find the right computer hardware at fair prices. Our team of tech experts is always ready to help you choose the perfect laptop, desktop or component for your specific needs.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Unlike big online marketplaces, we offer personalized service. You can call us, email us, or visit our store to get real advice from people who actually use and understand the products we sell.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🛡️", title: "100% Genuine", desc: "All products sourced from authorized distributors. No fakes, ever." },
              { icon: "💰", title: "Fair Pricing", desc: "Competitive prices with no hidden charges. What you see is what you pay." },
              { icon: "🔧", title: "Expert Advice", desc: "Our team helps you pick the right hardware for your budget and use case." },
              { icon: "🤝", title: "After-Sales Care", desc: "We support you after purchase — setup, warranty, upgrades and more." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-3 font-black text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we sell */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-[#2874f0] mb-3">What We Sell</p>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Our Product Range</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "💻", title: "Laptops", desc: "Gaming, business, ultrabooks from Dell, HP, Lenovo, ASUS and more." },
              { icon: "🖥️", title: "Desktops", desc: "Pre-built and custom desktop computers for home, office and gaming." },
              { icon: "⚡", title: "Components", desc: "CPUs, GPUs, RAM, SSDs, motherboards and power supplies." },
              { icon: "🔌", title: "Accessories", desc: "Monitors, keyboards, mice, headsets, webcams and cables." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-center">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 font-black text-gray-900">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2874f0] to-[#0d47a1] p-8 text-white text-center shadow-lg">
          <h2 className="text-2xl font-black mb-2">Ready to Find Your Perfect Tech?</h2>
          <p className="text-sm text-blue-200 mb-6">Browse our catalog and submit an enquiry. We&apos;ll get back to you within hours.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="rounded-lg bg-white px-6 py-3 text-sm font-black text-[#2874f0] hover:bg-blue-50 transition">
              🛒 Shop Now
            </Link>
            {PHONE && (
              <a href={`tel:${PHONE}`} className="rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition">
                📞 {PHONE}
              </a>
            )}
            {EMAIL && (
              <a href={`mailto:${EMAIL}`} className="rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition">
                ✉️ Email Us
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
