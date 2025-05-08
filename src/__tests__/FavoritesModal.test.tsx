import { render, screen, fireEvent } from '@testing-library/react';
import FavoritesModal from '../components/FavoritesModal';
import { Item } from '@/types/item';
import Image from 'next/image';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<typeof Image>) => {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        data-testid="mock-image"
        src={props.src?.toString()}
        alt={props.alt || ''} 
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));

describe('FavoritesModal Component', () => {
  const mockFavorites: Item[] = [
    {
      title: 'Test Item 1',
      description: 'Description 1',
      email: 'test1@example.com',
      price: '100',
      image: 'test1.jpg',
    },
    {
      title: 'Test Item 2',
      description: 'Description 2',
      email: 'test2@example.com',
      price: '200',
      image: 'test2.jpg',
    },
  ];

  const mockOnClose = jest.fn();
  const mockOnRemoveFavorite = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnRemoveFavorite.mockClear();
  });

  test('renders modal with favorite items', () => {
    render(
      <FavoritesModal
        isOpen={true}
        onClose={mockOnClose}
        favorites={mockFavorites}
        onRemoveFavorite={mockOnRemoveFavorite}
      />
    );

    expect(screen.getByText('My Favorites')).toBeInTheDocument();
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <FavoritesModal
        isOpen={true}
        onClose={mockOnClose}
        favorites={mockFavorites}
        onRemoveFavorite={mockOnRemoveFavorite}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onRemoveFavorite when remove button is clicked', () => {
    render(
      <FavoritesModal
        isOpen={true}
        onClose={mockOnClose}
        favorites={mockFavorites}
        onRemoveFavorite={mockOnRemoveFavorite}
      />
    );

    const removeButtons = screen.getAllByLabelText('Remove from favorites');
    fireEvent.click(removeButtons[0]);

    expect(mockOnRemoveFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnRemoveFavorite).toHaveBeenCalledWith(mockFavorites[0]);
  });

  test('displays no favorites message when favorites array is empty', () => {
    render(
      <FavoritesModal
        isOpen={true}
        onClose={mockOnClose}
        favorites={[]}
        onRemoveFavorite={mockOnRemoveFavorite}
      />
    );

    expect(screen.getByText('No favorites added yet.')).toBeInTheDocument();
  });

  test('modal is not rendered when isOpen is false', () => {
    render(
      <FavoritesModal
        isOpen={false}
        onClose={mockOnClose}
        favorites={mockFavorites}
        onRemoveFavorite={mockOnRemoveFavorite}
      />
    );

    expect(screen.queryByText('My Favorites')).not.toBeInTheDocument();
  });
});