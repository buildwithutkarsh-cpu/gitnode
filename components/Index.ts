// UI Components
export { BrutalistButton } from '@/components/ui/BrutalistButton';
export { TerminalWindow } from '@/components/ui/TerminalWindow';
export { SearchBar } from '@/components/ui/SearchBar';
export { StatCounter } from '@/components/ui/StatCounter';

// Layout Components
export { Navbar } from '@/components/layout/NavBar';
export { Footer } from '@/components/layout/Footer';
export { Layout } from '@/components/layout/Layout';

// Repository Components
export { RepoCard } from '@/components/repository/RepoCard';
export { IssueCard } from '@/components/repository/IssueCard';

// Dashboard Components
export { ActivityFeed } from '@/components/dashboard/ActivityFeed';

// Profile Components
export { ContributionGraph } from '@/components/user/ContributionGraph';

// Types
export type {
  Repository,
  User,
  Issue,
  PullRequest,
  Commit,
  RepositoryStats,
  ActivityEvent,
  Notification,
  Trend,
  BrutalistButtonProps,
} from '@/types/index';

// Hooks
export {
  useDebounce,
  useFetch,
  useLocalStorage,
  useClickOutside,
  useForm,
  useAsync,
} from '@/lib/hooks';

// Utilities
export {
  formatNumber,
  formatDate,
  truncate,
  slugify,
  isValidEmail,
  isValidUrl,
  copyToClipboard,
  generateId,
  parseGithubUrl,
  getFileExtension,
  highlightCode,
  createQueryString,
  parseQueryString,
  getContrastColor,
  cn,
  debounce,
  throttle,
} from '@/lib/utils';