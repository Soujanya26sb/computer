import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "TechZone Computer Shop";

export const metadata: Metadata = {
  title: {
    default: SHOP_NAME,
    template: `%s | ${SHOP_NAME}`,
  },
  description: "Laptops, desktops, PC components and accessories. Browse real inventory, compare specs and order directly with our team.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
