import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Incident } from "@/types/incidents";

interface UseReportsResult {
  reports: Incident[];
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
  const [reports, setReports] = useState<Incident[]>([]);
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
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        // Get total count
        const { count, error: countError } = await supabase
          .from("incidents")
          .select("*", { count: "exact", head: true })
          .eq("reported_by", user.id);

        if (countError) throw countError;

        // Get paginated data
        const { data, error: fetchError } = await supabase
          .from("incidents")
          .select("*")
          .eq("reported_by", user.id)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (fetchError) throw fetchError;

        // console.log('Raw incidents data:', data);

        const incidents: Incident[] = (data || []).map((item: any) => {
          // PostGIS stores location as a geography type
          // It might come back as an object with coordinates or as WKT string
          let latitude = 0;
          let longitude = 0;

          if (item.location) {
            // Try different formats
            if (typeof item.location === 'string') {
              // WKT format: "POINT(lng lat)"
              const match = item.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
              if (match) {
                longitude = parseFloat(match[1]);
                latitude = parseFloat(match[2]);
              }
            } else if (item.location.coordinates) {
              // GeoJSON format
              longitude = item.location.coordinates[0];
              latitude = item.location.coordinates[1];
            }
          }

          return {
            id: item.id,
            type: item.type,
            severity: item.severity,
            title: item.title,
            description: item.description,
            location: {
              latitude,
              longitude,
            },
            address: item.address,
            city: item.city,
            state: item.state,
            country: item.country,
            photos: item.photos || [],
            reported_by: item.reported_by,
            status: item.status,
            confirmed_count: item.confirmed_count || 0,
            created_at: item.created_at,
            updated_at: item.updated_at,
          };
        });
        
        if (append) {
          setReports((prev) => [...prev, ...incidents]);
        } else {
          setReports(incidents);
        }
        
        const total = count || 0;
        const totalPages = Math.ceil(total / itemsPerPage);
        
        setTotalReports(total);
        setCurrentPage(page);
        setHasMore(page < totalPages);
      } catch (err: any) {
        console.error("Error fetching incidents:", err);
        const errorMessage = err?.message || "Failed to load incidents";
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
