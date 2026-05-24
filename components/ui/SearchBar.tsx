'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search repositories, users, issues...',
  onSearch,
  size = 'md',
}) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex items-center gap-2 border-3 border-black bg-white transition-brutal
        ${focused ? 'border-yellow-400 bg-yellow-50' : ''}
        ${sizeStyles[size]}
      `}
    >
      <Search size={18} className="flex-shrink-0 text-black" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-grow bg-transparent outline-none font-mono text-black placeholder-gray-600"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="flex-shrink-0 p-1 hover:bg-black hover:text-white transition-brutal"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;