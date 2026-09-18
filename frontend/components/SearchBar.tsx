"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ placeholder = "Search laptops, desktops, PC parts..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("search", value.trim()); else params.delete("search");
    params.delete("page");
    router.push(`${pathname}?${params}`);
  }

  return (
    <form onSubmit={submit} className="flex w-full overflow-hidden rounded-lg border-2 border-[#2874f0] bg-white shadow-sm focus-within:shadow-[0_0_0_3px_rgba(40,116,240,0.15)]">
      <div className="grid w-12 shrink-0 place-items-center text-gray-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
      <button className="m-1 rounded-md bg-[#ff9f00] hover:bg-[#f0920a] px-5 text-xs font-black uppercase tracking-wider text-white transition">
        Search
      </button>
    </form>
  );
}
