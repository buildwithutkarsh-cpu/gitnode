export interface Repository {
  id: string;
  name: string;
  description: string;
  owner: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updated: string;
  isPrivate: boolean;
  isFork: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  repositories: number;
  location?: string;
  website?: string;
  joinedDate: string;
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  author: string;
  status: 'open' | 'closed';
  labels: string[];
  created: string;
  updated: string;
  repository: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  changes: {
    additions: number;
    deletions: number;
  };
  created: string;
  repository: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  sha: string;
  parentSha?: string;
}

export interface RepositoryStats {
  stars: number;
  watchers: number;
  forks: number;
  issues: number;
  pullRequests: number;
  contributors: number;
}

export interface ActivityEvent {
  id: string;
  type: 'push' | 'pull_request' | 'issue' | 'comment' | 'fork';
  user: string;
  repository: string;
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'issue' | 'pull_request' | 'comment' | 'mention';
  read: boolean;
  timestamp: string;
  link: string;
}

export interface Trend {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  growth: number;
}

export interface BrutalistButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}