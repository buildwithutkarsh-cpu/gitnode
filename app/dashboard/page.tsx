'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { RepoCard } from '@/components/repository/RepoCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { StatCounter } from '@/components/ui/StatCounter';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { Search, Clock, Star, Code } from 'lucide-react';

const mockUserRepos = [
  {
    name: 'AI Runtime',
    description: 'High-performance AI model inference engine',
    owner: 'username',
    stars: 2100,
    forks: 340,
    language: 'Rust',
    updated: '2 hours ago',
  },
  {
    name: 'Next.js Starter',
    description: 'Opinionated Next.js 14 starter template',
    owner: 'username',
    stars: 890,
    forks: 210,
    language: 'TypeScript',
    updated: '1 day ago',
  },
  {
    name: 'Database Utils',
    description: 'Universal database abstraction layer',
    owner: 'username',
    stars: 450,
    forks: 89,
    language: 'TypeScript',
    updated: '3 days ago',
  },
  {
    name: 'CLI Framework',
    description: 'Build powerful CLIs with zero boilerplate',
    owner: 'username',
    stars: 1200,
    forks: 250,
    language: 'Go',
    updated: '5 days ago',
  },
];

const mockActivity = [
  {
    id: '1',
    type: 'push' as const,
    user: 'you',
    repository: 'ai-runtime',
    description: 'Pushed 3 commits: Optimize tensor operations',
    timestamp: '1 hour ago',
  },
  {
    id: '2',
    type: 'pull_request' as const,
    user: 'collaborator',
    repository: 'next-js-starter',
    description: 'Opened PR: Update dependencies to latest versions',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'issue' as const,
    user: 'user123',
    repository: 'database-utils',
    description: 'Opened issue: Connection pooling improvements',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    type: 'fork' as const,
    user: 'dev456',
    repository: 'cli-framework',
    description: 'Forked your repository',
    timestamp: '8 hours ago',
  },
];

export default function DashboardPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold uppercase font-bold">DASHBOARD</h1>
            <BrutalistButton label="+ NEW REPOSITORY" variant="primary" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCounter value="12" label="Repositories" size="sm" />
            <StatCounter value="3" label="Pinned" variant="accent" size="sm" />
            <StatCounter value="847" label="Stars" variant="dark" size="sm" />
            <StatCounter value="2.4k" label="Followers" size="sm" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Your Repositories */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold uppercase font-bold tracking-tight">
                  YOUR REPOSITORIES
                </h2>
                <a href="/repositories" className="text-xs font-bold hover:underline">
                  VIEW ALL →
                </a>
              </div>

              <div className="grid gap-3">
                {mockUserRepos.map((repo, idx) => (
                  <RepoCard key={idx} repo={repo} />
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-bold uppercase mb-6 font-bold">
                RECENT ACTIVITY
              </h2>
              <ActivityFeed events={mockActivity} maxItems={8} />
            </section>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="border-3 border-black p-6 bg-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                QUICK ACTIONS
              </h3>
              <div className="flex flex-col gap-2">
                <button className="text-left text-xs font-mono hover:bg-black hover:text-white p-2 transition-brutal flex items-center gap-2">
                  <Code size={14} />
                  New Repository
                </button>
                <button className="text-left text-xs font-mono hover:bg-black hover:text-white p-2 transition-brutal flex items-center gap-2">
                  <Search size={14} />
                  Explore
                </button>
                <button className="text-left text-xs font-mono hover:bg-black hover:text-white p-2 transition-brutal flex items-center gap-2">
                  <Star size={14} />
                  Starred
                </button>
                <button className="text-left text-xs font-mono hover:bg-black hover:text-white p-2 transition-brutal flex items-center gap-2">
                  <Clock size={14} />
                  Recent
                </button>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="border-3 border-black p-6 bg-black text-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                TRENDING TOPICS
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  'rust',
                  'typescript',
                  'ai-ml',
                  'web3',
                  'devops',
                  'backend',
                ].map((topic) => (
                  <a
                    key={topic}
                    href={`/topics/${topic}`}
                    className="text-xs font-mono hover:text-yellow-400 transition-brutal"
                  >
                    #{topic}
                  </a>
                ))}
              </div>
            </div>

            {/* Contributions */}
            <div className="border-3 border-black p-6 bg-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                YOUR STATS
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>Commits</span>
                  <span className="font-bold">234</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-3">
                  <span>PRs</span>
                  <span className="font-bold">18</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-3">
                  <span>Issues</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-3">
                  <span>Reviews</span>
                  <span className="font-bold">67</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}