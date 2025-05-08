import { render, screen, fireEvent } from '@testing-library/react';
import ItemCard from '../components/ItemCard';
import { Item } from '@/types/item';
import Image from 'next/image';

// Mock Next.js Image component properly
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<typeof Image>) => {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img 
        src={props.src?.toString()} 
        alt={props.alt || ''} 
        style={{ objectFit: props.className?.includes('object-cover') ? 'cover' : 'contain' }}
        data-testid="mock-image"
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));

describe('ItemCard Component', () => {
  const mockItem: Item = {
    title: 'Test Item',
    description: 'This is a test description',
    email: 'test@example.com',
    price: '100',
    image: 'test.jpg',
  };

  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    mockToggleFavorite.mockClear();
  });

  test('renders item details correctly', () => {
    render(
      <ItemCard 
        item={mockItem} 
        onFavoriteToggle={mockToggleFavorite} 
        isFavorite={false}
      />
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('100€')).toBeInTheDocument();
  });

  test('displays favorite button correctly when not favorited', () => {
    render(
      <ItemCard 
        item={mockItem} 
        onFavoriteToggle={mockToggleFavorite} 
        isFavorite={false}
      />
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('displays favorite button correctly when favorited', () => {
    render(
      <ItemCard 
        item={mockItem} 
        onFavoriteToggle={mockToggleFavorite} 
        isFavorite={true}
      />
    );

    const favoriteButton = screen.getByLabelText('Remove from favorites');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('calls onFavoriteToggle when favorite button is clicked', () => {
    render(
      <ItemCard 
        item={mockItem} 
        onFavoriteToggle={mockToggleFavorite} 
        isFavorite={false}
      />
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockItem);
  });
});