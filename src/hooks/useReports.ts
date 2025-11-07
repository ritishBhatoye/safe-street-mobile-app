import { useState, useCallback, useEffect } from "react";
import { reportsService, Report } from "@/services/reports.service";

interface UseReportsResult {
  reports: Report[];
  currentPage: number;
  totalPages: number;
  totalReports: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchReports: (page: number) => Promise<void>;
  onRefresh: () => Promise<void>;
  handlePageChange: (newPage: number) => Promise<void>;
}

export const useReports = (itemsPerPage: number = 10): UseReportsResult => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);
        const response = await reportsService.getReports(page, itemsPerPage);
        setReports(response.reports);
        setTotalPages(response.totalPages);
        setTotalReports(response.total);
        setCurrentPage(page);
      } catch (err: any) {
        console.error("Error fetching reports:", err);
        const errorMessage = err?.message || "Failed to load reports";
        setError(errorMessage);
        setReports([]);
        setTotalPages(1);
        setTotalReports(0);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports(currentPage);
    setRefreshing(false);
  }, [currentPage, fetchReports]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      await fetchReports(newPage);
    },
    [fetchReports],
  );

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  return {
    reports,
    currentPage,
    totalPages,
    totalReports,
    loading,
    refreshing,
    error,
    fetchReports,
    onRefresh,
    handlePageChange,
  };
};
