import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search courses...",
  isLoading = false,
  value,
  onChange,
  className = ""
}) => {
  const [internalQuery, setInternalQuery] = useState('');

  // Use external value if provided, otherwise use internal state
  const query = value !== undefined ? value : internalQuery;
  const setQuery = onChange || setInternalQuery;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative max-w-md mx-auto ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-20 bg-dark-200 border border-dark-300 rounded-lg text-light-100 placeholder-light-400 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200 transition-colors"
          disabled={isLoading}
        />

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-400">
          🔍
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-light-400 hover:text-light-200 transition-colors"
            disabled={isLoading}
          >
            ✕
          </button>
        )}

        {/* Search Button */}
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? '...' : 'Go'}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
