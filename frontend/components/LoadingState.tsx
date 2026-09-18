export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2874f0] shadow-lg shadow-blue-200">
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
      <p className="text-sm font-bold text-gray-500">{message}</p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-[#2874f0] opacity-60" style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}
