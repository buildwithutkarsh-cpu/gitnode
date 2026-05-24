'use client';

import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { StatCounter } from '@/components/ui/StatCounter';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { RepoCard } from '@/components/repository/RepoCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

const mockTerminalCode = `$ git clone https://github.com/user/project
$ cd project
$ npm install
$ npm run dev

> Ready to build something brutal.`;

const mockRepos = [
  {
    name: 'React Brutalism',
    description: 'A React library for building brutalist interfaces',
    owner: 'gitnode',
    stars: 4200,
    forks: 890,
    language: 'TypeScript',
    updated: '2 days ago',
  },
  {
    name: 'Node Runtime',
    description: 'High-performance Node.js runtime optimized for edge computing',
    owner: 'gitnode',
    stars: 8900,
    forks: 2100,
    language: 'Rust',
    updated: '1 hour ago',
  },
  {
    name: 'CLI Tools',
    description: 'Essential command-line tools for developers',
    owner: 'gitnode',
    stars: 3400,
    forks: 640,
    language: 'Go',
    updated: '5 hours ago',
  },
];

const mockActivity = [
  {
    id: '1',
    type: 'push' as const,
    user: 'sarah',
    repository: 'react-brutalism',
    description: 'Merged pull request: Add dark mode support',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'pull_request' as const,
    user: 'mike',
    repository: 'node-runtime',
    description: 'Opened PR: Performance improvements to event loop',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'issue' as const,
    user: 'alex',
    repository: 'cli-tools',
    description: 'Opened issue: Windows compatibility',
    timestamp: '6 hours ago',
  },
];

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
            {/* Left: Hero Text */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-5xl lg:text-6xl font-bold uppercase mb-6 font-bold tracking-tighter leading-none">
                WHERE CODE LIVES AND BREATHES.
              </h1>
              <p className="text-base mb-8 font-mono opacity-80 max-w-md">
                The raw code platform for developers who mean business. No polish. No compromises.
                Just pure, unfiltered version control.
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-4 mb-8">
                <BrutalistButton
                  label="START BUILDING"
                  variant="primary"
                  size="lg"
                  className="bg-black text-white hover:bg-yellow-400 hover:text-black"
                />
                <BrutalistButton
                  label="EXPLORE"
                  variant="secondary"
                  size="lg"
                />
              </div>

              {/* Stats */}
              <div className="text-xs font-mono opacity-60">
                <p>✓ Deploy in seconds</p>
                <p>✓ Open source infrastructure</p>
                <p>✓ Raw performance focused</p>
              </div>
            </div>

            {/* Right: Terminal Window */}
            <div className="p-8 lg:p-12 flex items-center justify-center bg-black">
              <TerminalWindow title="gitnode init" code={mockTerminalCode} />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-0 border-t-4 border-black">
            <StatCounter value="2.4M+" label="Repositories" />
            <StatCounter value="18M+" label="Developers" variant="dark" />
            <StatCounter value="89K+" label="Open Issues" />
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-16 px-8 border-b-4 border-black bg-yellow-400">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold uppercase mb-8 font-bold">
            RAW. FAST. YOURS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-8">
            {[
              {
                title: 'ZERO LATENCY',
                desc: 'Optimized for performance at every layer',
                color: 'bg-yellow-400',
              },
              {
                title: 'OPEN SOURCE',
                desc: 'Full transparency. No black boxes. Ever.',
                color: 'bg-black text-white',
              },
              {
                title: 'HACKER NATIVE',
                desc: 'Built by developers, for developers',
                color: 'bg-black text-white',
              },
              {
                title: 'FULLY CUSTOMIZABLE',
                desc: 'Your code. Your rules. Full control.',
                color: 'bg-yellow-400',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`border-3 border-black p-8 ${item.color} flex flex-col justify-center`}
              >
                <h3 className="text-2xl font-bold uppercase mb-2 font-bold">
                  {item.title}
                </h3>
                <p className="text-sm font-mono">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Repositories */}
      <section className="py-16 px-8 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold uppercase mb-12 font-bold">
            TRENDING REPOSITORIES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {mockRepos.map((repo, idx) => (
              <RepoCard
                key={idx}
                repo={repo}
                variant={idx === 0 ? 'featured' : 'default'}
              />
            ))}
          </div>

          <div className="text-center">
            <BrutalistButton
              label="EXPLORE ALL REPOSITORIES"
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* Live Activity */}
      <section className="py-16 px-8 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold uppercase mb-12 font-bold">
            LIVE ACTIVITY
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ActivityFeed events={mockActivity} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="border-3 border-black p-6 bg-white">
                <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                  QUICK STATS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs">Commits Today</span>
                    <span className="font-bold">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">PRs Merged</span>
                    <span className="font-bold">3,421</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Issues Closed</span>
                    <span className="font-bold">2,156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">New Users</span>
                    <span className="font-bold">8,932</span>
                  </div>
                </div>
              </div>

              <div className="border-3 border-black p-6 bg-black text-white">
                <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                  HOW TO START
                </h3>
                <ol className="text-xs space-y-2 font-mono">
                  <li>1. Create account</li>
                  <li>2. Create repository</li>
                  <li>3. Push code</li>
                  <li>4. Deploy</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-8 bg-black text-white border-t-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold uppercase mb-6 font-bold">
            BUILD IN PUBLIC
          </h2>
          <p className="text-base font-mono mb-8 opacity-80">
            Join thousands of developers building the future of open source.
          </p>
          <BrutalistButton
            label="GET STARTED NOW"
            variant="secondary"
            size="lg"
            className="mx-auto"
          />
        </div>
      </section>
    </Layout>
  );
}