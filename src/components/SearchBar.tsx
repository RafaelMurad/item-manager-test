'use client';

import { useState, useCallback, memo } from 'react';
import { SearchBarProps } from '@/types/components';

const SearchBar = memo(function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState<string>(initialValue);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      onSearch({ query: '' });
    }
  }, [onSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query });
  }, [query, onSearch]);

  const handleReset = useCallback(() => {
    setQuery('');
    onSearch({ query: '' });
  }, [onSearch]);

  return (
    <div className="pt-2 pb-3">
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="w-5 h-5 text-teal-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="text"
          id="search"
          value={query}
          onChange={handleInputChange}
          className="block w-full p-3 pl-12 pr-28 text-gray-900 border-2 border-white rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white shadow-sm"
          placeholder="What are you looking for?"
        />
        {query && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute inset-y-0 right-24 flex items-center"
          >
            <span className="bg-gray-200 rounded-full p-1.5 hover:bg-gray-300 transition-colors">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-4 text-white bg-teal-700 rounded-full hover:bg-teal-800 focus:outline-none font-medium text-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
});

export default SearchBar;