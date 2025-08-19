import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useAuth, AuthProvider } from '@contexts/AuthContext'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('useAuth Hook', () => {
  test('initializes with unauthenticated state', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(true)
  })

  test('login function works correctly', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user.email).toBe('test@example.com')
  })

  test('logout function clears user state', async () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    // First login
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // Then logout
    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })
})
