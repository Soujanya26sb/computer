import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f1f3f6] px-4 text-center">
      <div className="text-8xl font-black text-[#2874f0] mb-4">404</div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 mb-8 max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-blue rounded-lg px-6 py-3 text-sm font-black">Go Home</Link>
        <Link href="/products" className="rounded-lg border-2 border-[#2874f0] px-6 py-3 text-sm font-black text-[#2874f0] hover:bg-blue-50 transition">Browse Products</Link>
      </div>
    </div>
  );
}
