'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatCounter } from '@/components/ui/StatCounter';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { IssueCard } from '@/components/repository/IssueCard';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import {
  Star,
  GitFork,
  Eye,
  Code2,
  FileText,
  AlertCircle,
  GitPullRequest,
} from 'lucide-react';

const mockIssues = [
  {
    id: '1',
    number: 42,
    title: 'Optimize performance on large datasets',
    description: 'Need to improve query performance for tables with >1M rows',
    author: 'developer1',
    status: 'open' as const,
    labels: ['performance', 'database'],
    updated: '2 hours ago',
    created: '1 week ago',
  },
  {
    id: '2',
    number: 38,
    title: 'Add TypeScript support',
    description: 'Users are requesting TypeScript type definitions',
    author: 'developer2',
    status: 'open' as const,
    labels: ['enhancement', 'typescript'],
    updated: '1 day ago',
    created: '2 weeks ago',
  },
];

const cloneCommand = `$ git clone https://github.com/gitnode/async-runtime.git
$ cd async-runtime
$ npm install
$ npm run dev`;

export default function RepositoryPage({
  params,
}: {
  params: { owner?: string; repo?: string };
}) {
  const repoName = params?.repo || 'async-runtime';
  const owner = params?.owner || 'gitnode';

  return (
    <Layout>
      {/* Repository Header */}
      <section className="border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Breadcrumb */}
          <div className="text-xs font-mono mb-6">
            <a href="/explore" className="hover:underline">
              EXPLORE
            </a>
            {' / '}
            <a href={`/users/${owner}`} className="hover:underline">
              {owner}
            </a>
            {' / '}
            <span className="font-bold">{repoName}</span>
          </div>

          {/* Title & Description */}
          <h1 className="text-5xl font-bold uppercase font-bold mb-4 tracking-tighter">
            {repoName}
          </h1>
          <p className="text-base font-mono mb-6 max-w-2xl opacity-80">
            High-performance async runtime designed for production systems. Minimal
            overhead, maximum reliability.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <BrutalistButton
              label="⭐ STAR"
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            />
            <BrutalistButton
              label="🍴 FORK"
              variant="secondary"
              size="sm"
            />
            <BrutalistButton label="⬇ CLONE" variant="secondary" size="sm" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCounter value="5.2k" label="Stars" size="sm" variant="accent" />
            <StatCounter value="1.2k" label="Forks" size="sm" />
            <StatCounter value="45" label="Watchers" size="sm" />
            <StatCounter value="TypeScript" label="Language" size="sm" variant="dark" />
            <StatCounter value="Apache 2.0" label="License" size="sm" />
          </div>
        </div>
      </section>

      {/* Clone Section */}
      <section className="border-b-3 border-black px-8 py-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <TerminalWindow title="clone this repository" code={cloneCommand} />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* README */}
            <section className="border-3 border-black p-8 bg-white">
              <h2 className="text-2xl font-bold uppercase font-bold mb-6 tracking-tight">
                README
              </h2>
              <div className="font-mono text-sm space-y-4">
                <h3 className="font-bold text-base">Installation</h3>
                <p>npm install @gitnode/async-runtime</p>
                <h3 className="font-bold text-base mt-6">Quick Start</h3>
                <p>
                  Create a new async runtime instance and execute tasks in parallel.
                </p>
                <pre className="bg-black text-green-400 p-4 overflow-x-auto">
{`const runtime = new AsyncRuntime();
await runtime.execute([
  task1(),
  task2(),
  task3()
]);`}
                </pre>
              </div>
            </section>

            {/* Open Issues */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold uppercase font-bold tracking-tight">
                  OPEN ISSUES
                </h2>
                <span className="text-sm font-bold bg-yellow-400 px-2 py-1 border-2 border-black">
                  12
                </span>
              </div>
              <div className="space-y-3">
                {mockIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </section>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* About */}
            <div className="border-3 border-black p-6 bg-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                ABOUT
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-bold uppercase opacity-60 mb-1">Main Branch</p>
                  <p className="font-mono">main</p>
                </div>
                <div className="border-t-2 border-black pt-3">
                  <p className="font-bold uppercase opacity-60 mb-1">Latest Release</p>
                  <p className="font-mono">v2.1.0</p>
                </div>
                <div className="border-t-2 border-black pt-3">
                  <p className="font-bold uppercase opacity-60 mb-1">Created</p>
                  <p className="font-mono">3 years ago</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-3 border-black p-6 bg-black text-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                LINKS
              </h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-xs font-mono hover:text-yellow-400 transition-brutal"
                >
                  → Homepage
                </a>
                <a
                  href="#"
                  className="block text-xs font-mono hover:text-yellow-400 transition-brutal"
                >
                  → Documentation
                </a>
                <a
                  href="#"
                  className="block text-xs font-mono hover:text-yellow-400 transition-brutal"
                >
                  → Issues
                </a>
                <a
                  href="#"
                  className="block text-xs font-mono hover:text-yellow-400 transition-brutal"
                >
                  → Pull Requests
                </a>
              </div>
            </div>

            {/* Contributors */}
            <div className="border-3 border-black p-6 bg-yellow-400">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                TOP CONTRIBUTORS
              </h3>
              <div className="space-y-2">
                {['sarah', 'mike', 'alex', 'jordan'].map((contributor) => (
                  <div
                    key={contributor}
                    className="flex items-center gap-2 text-xs font-mono"
                  >
                    <div className="w-6 h-6 border-2 border-black bg-white flex items-center justify-center font-bold">
                      {contributor.charAt(0).toUpperCase()}
                    </div>
                    <span>{contributor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="border-3 border-black p-6 bg-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                BADGES
              </h3>
              <div className="space-y-2">
                {[
                  'MIT License',
                  'Production Ready',
                  'Actively Maintained',
                ].map((badge) => (
                  <div
                    key={badge}
                    className="text-xs font-mono border-2 border-black p-2 text-center"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}