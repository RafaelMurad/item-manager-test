import { Item } from './item';

export interface SearchParams {
    query: string;
}

export interface SearchBarProps {
    onSearch: (params: SearchParams) => void;
    initialValue?: string;
}

export interface ItemCardProps {
    item: Item;
    onFavoriteToggle?: (item: Item) => void;
    isFavorite?: boolean;
    isPriority?: boolean;
}

export interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: Item[];
    onRemoveFavorite: (item: Item) => void;
}