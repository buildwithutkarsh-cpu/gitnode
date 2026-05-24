'use client';

import React from 'react';
import Link from 'next/link';
import { Star, GitFork, Lock } from 'lucide-react';
import { Repository } from '@/types';

interface RepoCardProps {
  repo: Partial<Repository>;
  variant?: 'default' | 'featured';
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  variant = 'default',
}) => {
  const borderVariant = {
    default: 'border-3 border-black',
    featured:
      'border-t-4 border-r-3 border-b-3 border-l-3 border-t-yellow-400 border-r-black border-b-black border-l-black',
  };

  return (
    <Link href={repo.url || '#'}>
      <div
        className={`
          p-4 bg-white transition-brutal cursor-pointer group
          hover:bg-black hover:text-white
          ${borderVariant[variant]}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-bold uppercase font-bold tracking-tight group-hover:text-yellow-400 transition-brutal">
            {repo.name}
          </h3>
          {repo.isPrivate && (
            <div className="flex-shrink-0 p-1 border-2 border-current">
              <Lock size={14} />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs mb-3 opacity-75 group-hover:opacity-100 transition-brutal">
          {repo.description || 'No description provided'}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-4 mb-3 text-xs font-mono">
          {repo.language && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-current border border-current"></div>
              <span className="uppercase">{repo.language}</span>
            </div>
          )}
          {repo.updated && (
            <span className="text-xs opacity-60">Updated {repo.updated}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t-2 border-current">
          <div className="flex items-center gap-1 text-xs font-bold uppercase">
            <Star size={14} />
            <span>{repo.stars || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold uppercase">
            <GitFork size={14} />
            <span>{repo.forks || 0}</span>
          </div>
          {repo.isFork && (
            <span className="text-xs font-bold uppercase opacity-60">FORKED</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RepoCard;