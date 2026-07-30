/**
 * useSkuSearch.ts
 * Reusable hook for paginated SKU search from odt_item_master.
 * Automatically filters by the current customer's businessStream.
 */

import { useState, useCallback, useRef } from 'react';
import { SkuMasterItem } from '../types';
import { searchSkusApi } from '../customerApi';

interface UseSkuSearchOptions {
  stream?: string; // filter by businessStream — set after customer selection
  limit?: number;
}

interface UseSkuSearchReturn {
  query: string;
  results: SkuMasterItem[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  hasMore: boolean;
  setQuery: (q: string) => void;
  loadMore: () => void;
  reset: () => void;
}

export function useSkuSearch({
  stream = '',
  limit = 30,
}: UseSkuSearchOptions = {}): UseSkuSearchReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SkuMasterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQuery = useRef('');

  const runSearch = useCallback(
    async (q: string, pageNum: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchSkusApi(q, stream, pageNum, limit);
        setTotal(res.total);
        setPage(res.page);
        setResults((prev) => (append ? [...prev, ...res.data] : res.data));
      } catch {
        setError('Failed to load SKUs. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [stream, limit],
  );

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q);
      currentQuery.current = q;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        runSearch(q, 1, false);
      }, 300);
    },
    [runSearch],
  );

  const loadMore = useCallback(() => {
    if (!loading && results.length < total) {
      runSearch(currentQuery.current, page + 1, true);
    }
  }, [loading, results.length, total, page, runSearch]);

  const reset = useCallback(() => {
    setQueryState('');
    setResults([]);
    setTotal(0);
    setPage(1);
    setError(null);
    currentQuery.current = '';
  }, []);

  return {
    query,
    results,
    loading,
    error,
    page,
    total,
    hasMore: results.length < total,
    setQuery,
    loadMore,
    reset,
  };
}
