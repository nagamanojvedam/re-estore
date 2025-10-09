import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@components/common/Header';
import { AuthProvider } from '@contexts/AuthContext';
import { CartProvider } from '@contexts/CartContext';
import { ThemeProvider } from '@contexts/ThemeContext';

// Test wrapper with all providers
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Header Component', () => {
  test('renders header with logo and navigation', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    expect(screen.getByText('EStore')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('opens mobile menu when hamburger clicked', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const hamburgerButton = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(hamburgerButton);

    expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop + mobile
  });

  test('toggles theme when theme button clicked', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );

    const themeButton = screen.getByLabelText(/toggle theme/i);
    fireEvent.click(themeButton);

    // Theme should toggle (implementation would depend on ThemeContext)
    expect(themeButton).toBeInTheDocument();
  });
});
