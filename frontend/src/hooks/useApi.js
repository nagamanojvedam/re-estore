import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshAccessToken, logout } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      // Handle token refresh
      if (err.response?.status === 401) {
        try {
          await refreshAccessToken();
          const response = await api.get(url, options);
          setData(response.data);
        } catch (refreshErr) {
          logout();
          setError(refreshErr);
        }
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, refreshAccessToken, logout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
