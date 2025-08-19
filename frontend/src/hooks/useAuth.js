
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useAuthContext()
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
