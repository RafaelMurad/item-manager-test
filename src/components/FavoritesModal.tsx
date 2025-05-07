'use client';

import { memo } from 'react';
import Image from 'next/image';
import { FavoritesModalProps } from '@/types/components';

const FavoritesModal = memo(function FavoritesModal({ 
  isOpen, 
  onClose, 
  favorites, 
  onRemoveFavorite 
}: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-teal-600">My Favorites</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-500">No favorites added yet.</p>
              <p className="text-gray-400 text-sm mt-2">Browse items and click the heart icon to add them to your favorites.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {favorites.map((item, index) => (
                <li key={`${item.title}-${index}`} className="py-3 flex items-center">
                  <div className="relative h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={`/items/${item.image}`}
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                    <p className="text-teal-600 font-bold text-sm">{item.price}€</p>
                  </div>
                  <button
                    onClick={() => onRemoveFavorite(item)}
                    className="ml-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                    aria-label="Remove from favorites"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

export default FavoritesModal;