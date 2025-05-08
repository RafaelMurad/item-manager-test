import { render, screen, waitFor } from '@testing-library/react';
import MswWorker, { useMsw } from '../components/MswWorker';

// Mock the MSW browser module
jest.mock('msw/browser', () => ({
  setupWorker: jest.fn(() => ({
    start: jest.fn().mockResolvedValue(undefined)
  }))
}));

// Mock dynamic imports with a module factory
jest.mock('@/mocks/browser', () => ({
  worker: {
    start: jest.fn().mockResolvedValue(undefined)
  }
}), { virtual: true });

// Store the original mock to modify it later
const workerMock = jest.requireMock('@/mocks/browser');

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();

// Mock process.env
const originalNodeEnv = process.env.NODE_ENV;

describe('MswWorker Component', () => {
  beforeAll(() => {
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    // Use Object.defineProperty to modify read-only properties
    Object.defineProperty(process.env, 'NODE_ENV', { 
      value: originalNodeEnv 
    });
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    Object.defineProperty(process.env, 'NODE_ENV', { 
      value: originalNodeEnv 
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { isMswReady } = useMsw();
    return <div data-testid="msw-status">{isMswReady ? 'MSW Ready' : 'MSW Not Ready'}</div>;
  };

  test('renders children and initializes context with default value', () => {
    render(
      <MswWorker>
        <TestComponent />
      </MswWorker>
    );
    
    expect(screen.getByTestId('msw-status')).toHaveTextContent('MSW Not Ready');
  });

  test('starts MSW worker in development environment', async () => {
    // Set environment to development
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    
    render(
      <MswWorker>
        <TestComponent />
      </MswWorker>
    );
    
    // Initially not ready
    expect(screen.getByTestId('msw-status')).toHaveTextContent('MSW Not Ready');
    
    // Wait for worker initialization to complete
    await waitFor(() => {
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[MSW] Mock service worker started successfully!')
      );
    });
  });

  test('does not start MSW worker in production environment', () => {
    // Set environment to production
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
    
    render(
      <MswWorker>
        <TestComponent />
      </MswWorker>
    );
    
    // Should remain not ready
    expect(screen.getByTestId('msw-status')).toHaveTextContent('MSW Not Ready');
    
    // Worker should not be started
    expect(mockConsoleLog).not.toHaveBeenCalledWith(
      expect.stringContaining('[MSW] Mock service worker started successfully!')
    );
  });

  test('handles errors when starting MSW worker', async () => {
    // Set environment to development
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    
    // Save the original implementation
    const originalStartMethod = workerMock.worker.start;
    
    // Override the start method to throw an error
    workerMock.worker.start = jest.fn().mockRejectedValue(new Error('Test error'));
    
    render(
      <MswWorker>
        <TestComponent />
      </MswWorker>
    );
    
    // Should remain not ready
    expect(screen.getByTestId('msw-status')).toHaveTextContent('MSW Not Ready');
    
    // Check for error log
    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('[MSW] Failed to initialize MSW:'),
        expect.anything()
      );
    });
    
    // Restore the original mock
    workerMock.worker.start = originalStartMethod;
  });
});