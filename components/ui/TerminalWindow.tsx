'use client';

import React from 'react';
import { Copy } from 'lucide-react';

interface TerminalWindowProps {
  title?: string;
  code: string;
  language?: string;
  showCopy?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'terminal',
  code,
  language = 'bash',
  showCopy = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-3 border-black bg-brutalist-code text-brutalist-green font-mono">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black bg-black">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 border border-black"></div>
          <div className="w-3 h-3 bg-yellow-400 border border-black"></div>
          <div className="w-3 h-3 bg-green-500 border border-black"></div>
        </div>
        <span className="text-xs font-bold uppercase text-brutalist-green">{title}</span>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-green-500/20 transition-brutal"
            title="Copy code"
          >
            <Copy size={14} />
          </button>
        )}
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap">
        <code>{code}</code>
      </pre>

      {/* Footer */}
      {copied && (
        <div className="px-4 py-2 border-t-2 border-black bg-green-500/20 text-xs font-bold">
          COPIED TO CLIPBOARD
        </div>
      )}
    </div>
  );
};

export default TerminalWindow;