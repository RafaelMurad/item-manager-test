import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemManager from '../components/ItemManager';
import { useMsw } from '../components/MswWorker';
import { Item } from '@/types/item';
import Image from 'next/image';

// Mock the components to simplify testing
jest.mock('../components/ItemCard', () => {
  return {
    __esModule: true,
    default: ({ item, onFavoriteToggle, isFavorite }: {
      item: Item;
      onFavoriteToggle: (item: Item) => void;
      isFavorite: boolean;
    }) => (
      <div data-testid={`item-card-${item.title}`}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <p>{item.price}€</p>
        <button 
          onClick={() => onFavoriteToggle(item)}
          data-testid={`favorite-button-${item.title}`}
        >
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </button>
      </div>
    ),
  };
});

// Mock the FavoritesModal component
jest.mock('../components/FavoritesModal', () => {
  return {
    __esModule: true,
    default: ({ isOpen, onClose, favorites, onRemoveFavorite }: {
      isOpen: boolean;
      onClose: () => void;
      favorites: Item[];
      onRemoveFavorite: (item: Item) => void;
    }) => {
      if (!isOpen) return null;
      return (
        <div data-testid="favorites-modal">
          <h2>My Favorites</h2>
          <ul>
            {favorites.map((item: Item, index: number) => (
              <li key={index} data-testid={`favorite-item-${item.title}`}>
                {item.title}
                <button 
                  onClick={() => onRemoveFavorite(item)}
                  data-testid={`remove-favorite-${item.title}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={onClose} data-testid="close-modal">Close</button>
        </div>
      );
    }
  };
});

// Mock the MswWorker hook
jest.mock('../components/MswWorker', () => ({
  useMsw: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<typeof Image>) => {
    // We need to disable Next.js img element rule only for tests
    /* eslint-disable @next/next/no-img-element */
    return (
      <img 
        src={props.src?.toString()} 
        alt={props.alt || ''} 
        data-testid="mock-image"
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));

// Mock fetch
const mockItems: Item[] = [
  { 
    title: 'Item 1', 
    description: 'Description 1', 
    price: '100', 
    email: 'test1@example.com', 
    image: 'image1.jpg' 
  },
  { 
    title: 'Item 2', 
    description: 'Description 2', 
    price: '200', 
    email: 'test2@example.com', 
    image: 'image2.jpg' 
  },
  { 
    title: 'Item 3', 
    description: 'Description 3', 
    price: '300', 
    email: 'test3@example.com', 
    image: 'image3.jpg' 
  },
  { 
    title: 'Item 4', 
    description: 'Description 4', 
    price: '400', 
    email: 'test4@example.com', 
    image: 'image4.jpg' 
  },
  { 
    title: 'Item 5', 
    description: 'Description 5', 
    price: '500', 
    email: 'test5@example.com', 
    image: 'image5.jpg' 
  },
];

const mockApiResponse = {
  items: mockItems,
  meta: {
    total: 20,
    hasMore: true
  }
};

describe('ItemManager Component', () => {
  beforeEach(() => {
    // Mock useMsw to return ready state
    (useMsw as jest.Mock).mockReturnValue({ isMswReady: true });
    
    // Create a proper Response mock
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: '',
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => '',
    };
    
    // TypeScript doesn't know about bytes in older definitions, so we use type assertion
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve(mockResponse as unknown as Response)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and renders items when MSW is ready', async () => {
    render(<ItemManager />);

    // Wait for items to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('item-card-Item 1')).toBeInTheDocument();
    });

    // Check if all items are rendered
    mockItems.forEach(item => {
      expect(screen.getByTestId(`item-card-${item.title}`)).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching items', async () => {
    // First mock a delay with a loading state
    const loadingState = { 
      items: [], 
      meta: { total: 0, hasMore: false } 
    };

    // Create mock responses with proper typing
    const mockDelayedResponse = {
      ok: true,
      json: () => new Promise(resolve => {
        setTimeout(() => resolve(loadingState), 100);
      }),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: '',
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => '',
    };

    const mockSecondResponse = {
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: '',
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => '',
    };

    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve(mockDelayedResponse as unknown as Response))
      .mockImplementationOnce(() => Promise.resolve(mockSecondResponse as unknown as Response));

    render(<ItemManager />);
    
    // Verify loading is visible by looking for the spinner
    await waitFor(() => {
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });
  });

  test('adds and removes items from favorites', async () => {
    render(<ItemManager />);

    // Wait for items to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('item-card-Item 1')).toBeInTheDocument();
    });

    // Add an item to favorites first
    fireEvent.click(screen.getByTestId('favorite-button-Item 1'));
    
    // Now find the favorites button in the DOM - since our mock uses data-testid, look for that
    const favoritesButtons = screen.getAllByText(/Favorites/i);
    expect(favoritesButtons.length).toBeGreaterThan(0);
    
    // Open favorites modal by clicking the first button
    fireEvent.click(favoritesButtons[0]);
    
    // Now the modal should be rendered by our mock
    await waitFor(() => {
      expect(screen.getByTestId('favorites-modal')).toBeInTheDocument();
    });
    
    // Check that our favorited item is in the list
    expect(screen.getByTestId('favorite-item-Item 1')).toBeInTheDocument();
    
    // Remove the item from favorites within the modal
    fireEvent.click(screen.getByTestId('remove-favorite-Item 1'));
    
    // Item should be removed
    expect(screen.queryByTestId('favorite-item-Item 1')).not.toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByTestId('close-modal'));
  });

  test('searches for items', async () => {
    // Mock search results
    const searchResults = {
      items: [mockItems[0]],
      meta: {
        total: 1,
        hasMore: false
      }
    };

    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(searchResults)
      }));

    render(<ItemManager />);

    // Wait for initial items to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('item-card-Item 1')).toBeInTheDocument();
    });

    // Get all search inputs and buttons 
    const searchInputs = screen.getAllByPlaceholderText(/What are you looking for\?/i);
    const searchButtons = screen.getAllByText('Search');
    
    // Use the first search input and button
    const searchInput = searchInputs[0];
    const searchButton = searchButtons[0];
    
    // Enter search query and submit
    fireEvent.change(searchInput, { target: { value: 'Item 1' } });
    fireEvent.click(searchButton);
    
    // Check that fetch was called with second time for the search
    await waitFor(() => {
      // Use toHaveBeenNthCalledWith to check the second call
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('Item+1'));
    });
    
    // After search, only Item 1 should be displayed
    await waitFor(() => {
      expect(screen.getByTestId('item-card-Item 1')).toBeInTheDocument();
      expect(screen.queryByTestId('item-card-Item 2')).not.toBeInTheDocument();
    });
  });
});