"use client";

export default function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-2xl">⚠️</div>
      <div>
        <p className="text-lg font-black text-gray-900">Unable to load</p>
        <p className="mt-1 max-w-md text-sm text-gray-500">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-blue rounded-lg px-6 py-2.5 text-sm font-black">
          Try Again
        </button>
      )}
    </div>
  );
}
