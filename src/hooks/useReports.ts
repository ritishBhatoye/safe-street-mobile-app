import { useState, useCallback, useEffect } from "react";
import { reportsService, Report } from "@/services/reports.service";

interface UseReportsResult {
  reports: Report[];
  totalReports: number;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useReports = (itemsPerPage: number = 10): UseReportsResult => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);
        
        const response = await reportsService.getReports(page, itemsPerPage);
        
        if (append) {
          setReports((prev) => [...prev, ...response.reports]);
        } else {
          setReports(response.reports);
        }
        
        setTotalReports(response.total);
        setCurrentPage(page);
        setHasMore(page < response.totalPages);
      } catch (err: any) {
        console.error("Error fetching reports:", err);
        const errorMessage = err?.message || "Failed to load reports";
        setError(errorMessage);
        if (!append) {
          setReports([]);
          setTotalReports(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [itemsPerPage],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchReports(1, false);
    setRefreshing(false);
  }, [fetchReports]);

  const loadMore = useCallback(async () => {
    if (!loadingMore && !loading && hasMore) {
      await fetchReports(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loading, loadingMore, fetchReports]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  return {
    reports,
    totalReports,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    onRefresh,
    loadMore,
  };
};
