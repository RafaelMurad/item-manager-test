'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Item } from '@/types/item';

interface ItemCardProps {
  item: Item;
  onFavoriteToggle: (item: Item) => void;
  isFavorite: boolean;
  isPriority?: boolean;
}

const ItemCard = memo(function ItemCard({ 
  item, 
  onFavoriteToggle, 
  isFavorite, 
  isPriority = false 
}: ItemCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(item);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative aspect-square w-full bg-gray-100">
        <Image
          src={`/items/${item.image}`}
          alt={item.title}
          fill
          priority={isPriority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
            isFavorite ? 'bg-teal-500 text-white' : 'bg-white text-gray-400'
          } shadow-md hover:scale-110 transition-all duration-150`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-1 flex-grow">
          <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-lg text-teal-600">{`${item.price}€`}</span>
          <span className="text-xs text-gray-400 truncate max-w-[150px]">{item.email}</span>
        </div>
      </div>
    </div>
  );
});

export default ItemCard;