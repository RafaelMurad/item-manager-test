# Wallapop Item Manager

A single page application (SPA) built with Next.js that allows users to search for items, view item details, and manage a favorites list.

## Features

- **Item Search**: Search items by title, description, price, and email
- **Item Display**: View detailed item information including images
- **Favorites Management**: Add and remove items from a favorites list
- **Infinite Scrolling**: Load more items as you scroll down the page
- **Responsive Design**: Works well on mobile, tablet, and desktop devices

## Technologies Used

- **Next.js**: React framework with App Router for modern web applications
- **TypeScript**: For type safety and improved developer experience
- **MSW (Mock Service Worker)**: For mocking API requests during development
- **Tailwind CSS**: For efficient and responsive styling
- **React Testing Library**: For component testing
- **Jest**: For test runner and assertions

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd item-manager-test
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/`: Next.js App Router pages and layout
- `src/components/`: React components used throughout the application
- `src/mocks/`: MSW configuration and mock data
- `src/types/`: TypeScript type definitions
- `src/__tests__/`: Unit and integration tests for components

## Key Decisions

### 1. Next.js App Router

Used Next.js with the App Router for its built-in performance optimizations, file-based routing, and server-side rendering capabilities, which improve both developer experience and application performance.

### 2. MSW for API Mocking

Implemented Mock Service Worker to simulate API behavior without needing a real backend. This allowed for:
- Development without external dependencies
- Consistent data for testing
- Ability to simulate network conditions and errors

### 3. Favorites Implementation

- Favorites are stored in React state and not persisted after page reload (as per requirements)
- Implemented a modal to display and manage favorite items
- Used efficient state management to prevent unnecessary re-renders

### 4. Infinite Scroll

- Implemented using the Intersection Observer API for performance
- Initial load of 5 items with additional items loaded as the user scrolls
- Manual "Load More" button as fallback

### 5. Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading of images below the fold
- Code splitting for reduced initial load time
- Optimized re-renders with careful state management

### 6. Responsive Design

- Used Tailwind CSS for a mobile-first responsive design approach
- Ensured the interface works well across various device sizes

## Testing

The project includes a comprehensive test suite using Jest and React Testing Library.

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers all major components and functionalities:

- **Component Tests**:
  - `ItemCard`: Tests for rendering, interaction, and favorite functionality
  - `FavoritesModal`: Tests for rendering favorites, adding/removing items
  - `SearchBar`: Tests for input handling, form submission, and reset functionality
  - `ItemManager`: Integration tests for fetching items, searching, and favorites management
  - `MswWorker`: Tests for MSW initialization in different environments

### Test Features

- **Mocks**:
  - Next.js Image component mocked for testing
  - IntersectionObserver API mocked for infinite scroll testing
  - MSW mocked for API testing
  - Fetch API mocked for testing async data fetching

- **Environment**:
  - Jest configured with Next.js support
  - Custom TypeScript declarations for testing utilities
  - Environment variables handled properly in test context

## Future Improvements

- Add more comprehensive end-to-end tests with tools like Cypress or Playwright
- Implement skeleton loading states
- Add filter options for more refined searches
- Improve accessibility features
- Expand test coverage to edge cases and error handling scenarios
