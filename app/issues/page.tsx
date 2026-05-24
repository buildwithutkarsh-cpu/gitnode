'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { IssueCard } from '@/components/repository/IssueCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { BrutalistButton } from '@/components/ui/BrutalistButton';

const mockIssues = [
  {
    id: '1',
    number: 127,
    title: 'Fix memory leak in async runtime',
    description:
      'Critical memory leak identified in event loop handler. Affects production systems.',
    author: 'sarah',
    status: 'open' as const,
    labels: ['bug', 'critical', 'performance'],
    updated: '2 hours ago',
    created: '1 day ago',
    repository: 'async-runtime',
  },
  {
    id: '2',
    number: 125,
    title: 'Add support for custom middleware',
    description:
      'Users need ability to create custom middleware for request processing',
    author: 'mike',
    status: 'open' as const,
    labels: ['enhancement', 'feature-request'],
    updated: '4 hours ago',
    created: '1 week ago',
    repository: 'web-framework',
  },
  {
    id: '3',
    number: 122,
    title: 'TypeScript definitions incomplete',
    description: 'Several exported types are missing from type definitions',
    author: 'alex',
    status: 'open' as const,
    labels: ['bug', 'typescript'],
    updated: '1 day ago',
    created: '2 weeks ago',
    repository: 'cli-tools',
  },
  {
    id: '4',
    number: 120,
    title: 'Improve documentation for edge cases',
    description: 'Document behavior for corner cases in API',
    author: 'jordan',
    status: 'open' as const,
    labels: ['documentation'],
    updated: '2 days ago',
    created: '1 month ago',
    repository: 'database-engine',
  },
];

export default function IssuesPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('open');
  const [filterLabel, setFilterLabel] = useState<string | null>(null);

  const allLabels = ['bug', 'enhancement', 'documentation', 'performance', 'critical'];

  return (
    <Layout>
      {/* Header */}
      <section className="border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold uppercase font-bold mb-8">ISSUES</h1>

          {/* Search */}
          <div className="mb-8">
            <SearchBar
              placeholder="Search issues..."
              size="lg"
              onSearch={(q) => console.log('Search:', q)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'open', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-3 py-2 text-xs font-bold uppercase border-3 border-black transition-brutal ${
                    filterStatus === status
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-black hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'ALL' : status === 'open' ? 'OPEN' : 'CLOSED'}
                </button>
              ))}
            </div>

            {/* Label Filter */}
            <div className="flex gap-2 flex-wrap">
              {allLabels.map((label) => (
                <button
                  key={label}
                  onClick={() =>
                    setFilterLabel(filterLabel === label ? null : label)
                  }
                  className={`px-3 py-2 text-xs font-bold uppercase border-2 border-black transition-brutal ${
                    filterLabel === label
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-black hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b-3 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase">
              {filterStatus === 'open' ? 'OPEN' : filterStatus === 'closed' ? 'CLOSED' : 'ALL'}{' '}
              ISSUES
            </p>
            <p className="text-xs font-mono opacity-75 mt-1">
              Showing {mockIssues.length} issues
            </p>
          </div>
          <BrutalistButton
            label="+ NEW ISSUE"
            variant="secondary"
            size="sm"
            className="bg-yellow-400 text-black hover:bg-black hover:text-yellow-400"
          />
        </div>
      </section>

      {/* Issues List */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-3">
            {mockIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <BrutalistButton
              label="LOAD MORE"
              variant="secondary"
              size="lg"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}