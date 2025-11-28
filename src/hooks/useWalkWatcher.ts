import { useState, useEffect } from 'react';
import { walkService } from '@/services/walk.service';

export const useWalkWatcher = (walkId: string) => {
  const [walk, setWalk] = useState<Walk | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
  const [watchers, setWatchers] = useState<WalkWatcher[]>([]);
  const [alerts, setAlerts] = useState<WalkAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWalkData = async () => {
      try {
        setLoading(true);
        const [walkData, watchersData, alertsData] = await Promise.all([
          walkService.getWalk(walkId),
          walkService.getWatchers(walkId),
          walkService.getAlerts(walkId),
        ]);

        setWalk(walkData);
        setWatchers(watchersData);
        setAlerts(alertsData);

        // Set initial location from last known
        if (walkData.last_lat && walkData.last_lng) {
          setLiveLocation({
            latitude: walkData.last_lat,
            longitude: walkData.last_lng,
            timestamp: Date.now(),
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWalkData();

    // Subscribe to live location updates (Zomato style streaming)
    const unsubscribe = walkService.subscribeToLocation(walkId, (location) => {
      setLiveLocation(location);
    });

    return () => {
      unsubscribe();
    };
  }, [walkId]);

  return {
    walk,
    liveLocation,
    watchers,
    alerts,
    loading,
    error,
  };
};
