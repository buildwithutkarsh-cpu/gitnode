'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RepoCard } from '@/components/repository/RepoCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

const mockTrendingRepos = [
  {
    name: 'Rust Web Framework',
    description: 'Ultra-fast web framework with zero overhead',
    owner: 'webtech',
    stars: 12400,
    forks: 2800,
    language: 'Rust',
    updated: '1 hour ago',
  },
  {
    name: 'AI Model Trainer',
    description: 'Distributed training framework for large language models',
    owner: 'ailab',
    stars: 9870,
    forks: 2100,
    language: 'Python',
    updated: '2 hours ago',
  },
  {
    name: 'Database Engine',
    description: 'Next-generation embedded database',
    owner: 'datatech',
    stars: 8900,
    forks: 1900,
    language: 'Rust',
    updated: '4 hours ago',
  },
  {
    name: 'API Gateway',
    description: 'High-performance API gateway with built-in security',
    owner: 'cloudops',
    stars: 7200,
    forks: 1400,
    language: 'Go',
    updated: '5 hours ago',
  },
  {
    name: 'React Brutalism',
    description: 'React library for building brutalist UIs',
    owner: 'gitnode',
    stars: 6800,
    forks: 1200,
    language: 'TypeScript',
    updated: '8 hours ago',
  },
  {
    name: 'CLI Builder',
    description: 'Zero-boilerplate CLI framework for Node.js',
    owner: 'devtools',
    stars: 5600,
    forks: 980,
    language: 'TypeScript',
    updated: '12 hours ago',
  },
];

export default function ExploreRepositoriesPage() {
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'forks'>('stars');
  const [language, setLanguage] = useState<string | null>(null);

  const languages = ['TypeScript', 'Rust', 'Go', 'Python', 'Java', 'C++'];

  return (
    <Layout>
      {/* Header */}
      <section className="border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold uppercase font-bold mb-8">EXPLORE</h1>

          {/* Search */}
          <div className="mb-8">
            <SearchBar
              placeholder="Search repositories..."
              size="lg"
              onSearch={(q) => console.log('Search:', q)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Sort */}
            <div className="flex gap-2">
              <span className="text-xs font-bold uppercase opacity-60 self-center">
                SORT BY:
              </span>
              {['stars', 'updated', 'forks'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option as any)}
                  className={`px-3 py-2 text-xs font-bold uppercase border-3 border-black transition-brutal ${
                    sortBy === option
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-black hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Language Filter */}
            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold uppercase opacity-60">LANGUAGE:</span>
              <select
                value={language || ''}
                onChange={(e) => setLanguage(e.target.value || null)}
                className="px-3 py-2 text-xs font-bold uppercase border-3 border-black bg-white cursor-pointer"
              >
                <option value="">ALL</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button className="ml-auto text-xs font-bold uppercase hover:underline opacity-60">
              CLEAR FILTERS
            </button>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="border-b-3 border-black bg-yellow-400">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h2 className="text-2xl font-bold uppercase font-bold mb-6 tracking-tight">
            TRENDING TODAY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTrendingRepos.slice(0, 3).map((repo, idx) => (
              <RepoCard key={idx} repo={repo} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* All Repositories */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold uppercase font-bold tracking-tight">
              ALL REPOSITORIES
            </h2>
            <span className="text-sm font-mono opacity-60">
              Showing 1-6 of 2,847 repositories
            </span>
          </div>

          {/* Repository Grid */}
          <div className="grid gap-3 mb-12">
            {mockTrendingRepos.map((repo, idx) => (
              <RepoCard key={idx} repo={repo} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <BrutalistButton
              label="← PREVIOUS"
              variant="secondary"
              size="sm"
              disabled
            />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 text-xs font-bold border-3 border-black transition-brutal ${
                    page === 1
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-black hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <BrutalistButton label="NEXT →" variant="secondary" size="sm" />
          </div>
        </div>
      </section>
    </Layout>
  );
}