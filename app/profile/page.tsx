'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ContributionGraph } from '@/components/profile/ContributionGraph';
import { RepoCard } from '@/components/repository/RepoCard';
import { StatCounter } from '@/components/ui/StatCounter';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MapPin, Link as LinkIcon, Mail, Code2 } from 'lucide-react';

// Mock contribution data (52 weeks of data)
const generateContributionData = () => {
  const weeks = [];
  for (let i = 0; i < 52; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(Math.floor(Math.random() * 12));
    }
    weeks.push(week);
  }
  return weeks;
};

const mockUserRepos = [
  {
    name: 'Async Runtime',
    description: 'Production-grade async runtime for TypeScript',
    owner: 'sarah',
    stars: 5600,
    forks: 1200,
    language: 'TypeScript',
    updated: '1 day ago',
  },
  {
    name: 'Web Framework',
    description: 'Modern web framework with zero JavaScript',
    owner: 'sarah',
    stars: 8900,
    forks: 2100,
    language: 'Rust',
    updated: '3 days ago',
  },
];

export default function ProfilePage({ params }: { params: { username?: string } }) {
  const username = params?.username || 'sarah';
  const contributionData = generateContributionData();

  return (
    <Layout>
      {/* Profile Header */}
      <section className="border-b-4 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="w-24 h-24 border-3 border-white bg-yellow-400 flex items-center justify-center">
                <span className="text-4xl font-bold">{username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold uppercase font-bold mb-2">
                  {username}
                </h1>
                <p className="text-sm font-mono opacity-75">
                  Full-stack developer. Open source advocate.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCounter
                value="48"
                label="Repositories"
                variant="dark"
                size="sm"
              />
              <StatCounter value="3.2k" label="Followers" variant="dark" size="sm" />
              <StatCounter value="512" label="Following" variant="dark" size="sm" />
              <StatCounter value="12.4k" label="Stars" variant="dark" size="sm" />
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-mono">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <Mail size={16} />
                <a href="mailto:sarah@example.com" className="hover:text-yellow-400">
                  sarah@example.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <LinkIcon size={16} />
                <a href="#" className="hover:text-yellow-400">
                  sarah.dev
                </a>
              </div>
              <div className="flex gap-2 mt-4">
                <BrutalistButton
                  label="FOLLOW"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                />
                <BrutalistButton
                  label="SPONSOR"
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-yellow-400 text-black hover:bg-black hover:text-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contribution Graph */}
            <section>
              <ContributionGraph data={contributionData} year={2024} maxValue={12} />
            </section>

            {/* Pinned Repositories */}
            <section>
              <h2 className="text-2xl font-bold uppercase font-bold mb-6 tracking-tight">
                PINNED REPOSITORIES
              </h2>
              <div className="grid gap-3">
                {mockUserRepos.map((repo, idx) => (
                  <RepoCard key={idx} repo={repo} variant="featured" />
                ))}
              </div>
            </section>

            {/* All Repositories */}
            <section>
              <h2 className="text-2xl font-bold uppercase font-bold mb-6 tracking-tight">
                ALL REPOSITORIES
              </h2>
              <div className="grid gap-3">
                {[
                  {
                    name: 'CLI Tools Pro',
                    description: 'Advanced CLI tool builder',
                    stars: 3200,
                    forks: 640,
                    language: 'Go',
                    updated: '1 week ago',
                  },
                  {
                    name: 'Database ORM',
                    description: 'Type-safe ORM for modern databases',
                    stars: 2100,
                    forks: 420,
                    language: 'TypeScript',
                    updated: '2 weeks ago',
                  },
                ].map((repo, idx) => (
                  <RepoCard key={idx} repo={repo} />
                ))}
              </div>
            </section>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Achievements */}
            <div className="border-3 border-black p-6 bg-yellow-400">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                ACHIEVEMENTS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Prolific', 'Maintainer', 'Collaborator', 'Pioneer'].map((badge) => (
                  <div
                    key={badge}
                    className="border-2 border-black p-2 bg-white text-center text-xs font-bold uppercase"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="border-3 border-black p-6 bg-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                TOP LANGUAGES
              </h3>
              <div className="space-y-3">
                {[
                  { lang: 'TypeScript', pct: 45 },
                  { lang: 'Rust', pct: 30 },
                  { lang: 'Go', pct: 15 },
                  { lang: 'Python', pct: 10 },
                ].map((item) => (
                  <div key={item.lang}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono">{item.lang}</span>
                      <span className="text-xs font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 border-2 border-black bg-gray-200">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${item.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-3 border-black p-6 bg-black text-white">
              <h3 className="text-sm font-bold uppercase mb-4 tracking-widest">
                ORGANIZATIONS
              </h3>
              <div className="space-y-2">
                {['TechCorp', 'OpenSource Co', 'Dev Community'].map((org) => (
                  <a
                    key={org}
                    href="#"
                    className="block text-xs font-mono hover:text-yellow-400 transition-brutal"
                  >
                    @{org.toLowerCase().replace(' ', '-')}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}