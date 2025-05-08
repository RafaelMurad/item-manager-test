import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        initialValue=""
      />
    );

    expect(screen.getByPlaceholderText('What are you looking for?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('calls onSearch when form is submitted', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        initialValue=""
      />
    );

    const input = screen.getByPlaceholderText('What are you looking for?');
    const submitButton = screen.getByRole('button', { name: 'Search' });

    await userEvent.type(input, 'test query');
    fireEvent.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith({ query: 'test query' });
  });

  test('clears input when reset button is clicked', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        initialValue=""
      />
    );

    const input = screen.getByPlaceholderText('What are you looking for?');

    // Type something to make the reset button appear
    await userEvent.type(input, 'test query');

    // The reset button should now be visible
    const resetButton = screen.getByRole('button', { name: '' });
    fireEvent.click(resetButton);

    // Input should be cleared and onSearch called with empty query
    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith({ query: '' });
  });

  test('initializes with initialValue prop', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        initialValue="initial query"
      />
    );

    const input = screen.getByPlaceholderText('What are you looking for?');
    expect(input).toHaveValue('initial query');
  });
});