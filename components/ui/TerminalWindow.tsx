// components/ui/TerminalWindow.tsx

import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({
  title = "terminal",
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div
      className={`border-3 border-black font-mono text-sm ${className}`}
    >
      {/* ─── Title Bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-black px-4 py-2 border-b-3 border-black">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-700" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
          <span className="w-3 h-3 rounded-full bg-green-500 border border-green-700" />
        </div>
        <span className="text-gray-400 text-xs ml-2 truncate">{title}</span>
      </div>

      {/* ─── Content Area ──────────────────────────────────────── */}
      <div className="bg-gray-950 text-gray-100 p-4 overflow-x-auto leading-relaxed min-h-[80px]">
        {children}
      </div>
    </div>
  );
}