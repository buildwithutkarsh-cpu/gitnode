'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Issue } from '@/types';

interface IssueCardProps {
  issue: Partial<Issue>;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const isOpen = issue.status === 'open';
  const statusIcon = isOpen ? (
    <AlertCircle size={16} className="text-brutalist-yellow" />
  ) : (
    <CheckCircle size={16} className="text-brutalist-green" />
  );

  return (
    <Link href={`/issues/${issue.id}`}>
      <div className="p-4 border-3 border-black hover:bg-black hover:text-white transition-brutal cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-1 border-2 border-current">
            {statusIcon}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold uppercase group-hover:text-yellow-400 transition-brutal">
                #{issue.number} {issue.title}
              </h4>
            </div>
            <p className="text-xs opacity-75 mt-2">{issue.description}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-xs font-mono opacity-60">
                by {issue.author}
              </span>
              {issue.labels && issue.labels.length > 0 && (
                <div className="flex gap-1">
                  {issue.labels.map((label) => (
                    <span
                      key={label}
                      className="text-xs font-bold px-2 py-1 border-2 border-current"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span className="text-xs font-mono opacity-60 flex-shrink-0">
            {issue.updated}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;