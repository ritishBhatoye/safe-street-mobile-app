import { useState, useEffect, useCallback } from "react";
import { homeService } from "@/services/home.service";
import * as Location from "expo-location";

interface UseHomeDataResult {
  safetyScore: SafetyScoreType | null;
  nearbyIncidents: NearbyIncidentType[];
  hotspots: HotspotType[];
  communityActivity: CommunityActivityType | null;
  userLocation: Location.LocationObject | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
}

export const useHomeData = (): UseHomeDataResult => {
  const [safetyScore, setSafetyScore] = useState<SafetyScoreType | null>(null);
  const [nearbyIncidents, setNearbyIncidents] = useState<NearbyIncidentType[]>([]);
  const [hotspots, setHotspots] = useState<HotspotType[]>([]);
  const [communityActivity, setCommunityActivity] = useState<CommunityActivityType | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefreshing: boolean = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      // Get user location
      const location = await homeService.getCurrentLocation();
      if (!location) {
        throw new Error("Unable to get location. Please enable location services.");
      }

      setUserLocation(location);

      const { latitude, longitude } = location.coords;

      // Fetch all data in parallel
      const [score, incidents, hotspotsData, activity] = await Promise.all([
        homeService.getSafetyScore(latitude, longitude),
        homeService.getNearbyIncidents(latitude, longitude, 5),
        homeService.getHotspots(latitude, longitude, 10),
        homeService.getCommunityActivity(),
      ]);

      setSafetyScore(score);
      setNearbyIncidents(incidents);
      setHotspots(hotspotsData);
      setCommunityActivity(activity);
    } catch (err: any) {
      console.error("Error fetching home data:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    // Refresh community activity every 5 minutes
    const interval = setInterval(async () => {
      const activity = await homeService.getCommunityActivity();
      setCommunityActivity(activity);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    safetyScore,
    nearbyIncidents,
    hotspots,
    communityActivity,
    userLocation,
    loading,
    refreshing,
    error,
    onRefresh,
  };
};
