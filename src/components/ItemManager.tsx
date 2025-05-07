'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Item } from '@/types/item';
import ItemCard from './ItemCard';
import SearchBar from './SearchBar';
import FavoritesModal from './FavoritesModal';
import { useMsw } from './MswWorker';
import { SearchParams } from '@/types/components';
import type { ApiResponse, ApiErrorResponse } from '@/types/api';

export default function ItemManager() {
  const { isMswReady } = useMsw();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (!isMswReady) {
      console.log('[ItemManager] Waiting for MSW to be ready...');
      return;
    }
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[ItemManager] Fetching items with MSW ready');
        
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        params.append('page', page.toString());
        params.append('limit', '5');
        
        const response = await fetch(`/api/items?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.status}`);
        }
        
        const data = await response.json() as ApiResponse | ApiErrorResponse;
        
        if ('error' in data) {
          throw new Error(data.error.message);
        }

        if (page === 1) {
          setItems(data.items);
        } else {
          setItems((prevItems) => [...prevItems, ...data.items]);
        }
        
        setTotalItems(data.meta.total);
        setHasMore(data.meta.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery, page, isMswReady]);

  const handleSearch = (params: SearchParams) => {
    setSearchQuery(params.query);
    setPage(1);
  };

  const handleFavoriteToggle = (item: Item) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(
        (favItem) => favItem.title === item.title && favItem.email === item.email
      );
      
      if (isAlreadyFavorite) {
        return prevFavorites.filter(
          (favItem) => !(favItem.title === item.title && favItem.email === item.email)
        );
      } else {
        return [...prevFavorites, item];
      }
    });
  };

  const isFavorite = (item: Item) => {
    return favorites.some(
      (favItem) => favItem.title === item.title && favItem.email === item.email
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20">
        <header className="bg-teal-600 text-white shadow-md">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Desktop header */}
            <div className="hidden md:flex items-center justify-between h-16">
              <h1 className="text-xl font-bold">Wallapop</h1>
              <div className="max-w-xl w-full px-8">
                <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1 bg-white text-teal-600 rounded-full py-1.5 px-4 hover:bg-opacity-90 transition-colors"
              >
                <svg className="w-5 h-5" fill={favorites.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="ml-1">Favorites ({favorites.length})</span>
              </button>
            </div>

            {/* Mobile header */}
            <div className="md:hidden py-3">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-bold">Wallapop</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-1 bg-white text-teal-600 rounded-full py-1.5 px-4 hover:bg-opacity-90 transition-colors"
                >
                  <svg className="w-5 h-5" fill={favorites.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="ml-1">Favorites ({favorites.length})</span>
                </button>
              </div>
              <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            </div>
          </div>
        </header>
      </div>

      <div className="container mx-auto px-4 pt-6 max-w-6xl">
        {!isMswReady && (
          <div className="p-4 mb-4 bg-blue-100 text-blue-700 rounded-md">
            Initializing services... Please wait.
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery && `Results for "${searchQuery}"`}
            {searchQuery && items.length > 0 && (
              <span className="text-gray-500 font-normal">
                · {items.length} of {totalItems} items
              </span>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              ref={index === items.length - 1 ? lastItemRef : null}
            >
              <ItemCard
                item={item}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite(item)}
                isPriority={index < 6}
              />
            </div>
          ))}
        </div>

        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin w-8 h-8">
              <svg className="text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}

        {!loading && isMswReady && items.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">No items found matching your search criteria.</p>
            <p className="text-sm mt-2">Try using different search terms.</p>
          </div>
        )}
        
        {hasMore && !loading && (
          <div className="text-center py-6">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-6 py-2 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors"
            >
              Load More Items
            </button>
          </div>
        )}
      </div>

      <footer className="bg-gray-100 mt-12 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Wallapop Item Manager - Created for demonstration purposes</p>
          </div>
        </div>
      </footer>

      <FavoritesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleFavoriteToggle}
      />
    </div>
  );
}