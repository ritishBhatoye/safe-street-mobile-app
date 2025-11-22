import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { WALK_CONFIG } from '@/constants/walk';
import { walkService } from '@/services/walk.service';

export const useLocationTracking = (walkId: string | null, isActive: boolean) => {
  const [currentLocation, setCurrentLocation] = useState<LiveLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!walkId || !isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }

        // Start tracking
        intervalRef.current = setInterval(async () => {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });

            const liveLocation: LiveLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy || undefined,
              speed: location.coords.speed || undefined,
              heading: location.coords.heading || undefined,
              timestamp: location.timestamp,
            };

            setCurrentLocation(liveLocation);

            // Update last known location in DB
            await walkService.updateLastLocation(walkId, liveLocation);

            // Broadcast to watchers (Zomato style - no DB storage)
            walkService.broadcastLocation(walkId, liveLocation);
          } catch (err) {
            console.error('Location update error:', err);
          }
        }, WALK_CONFIG.LOCATION_UPDATE_INTERVAL);
      } catch (err: any) {
        setError(err.message);
      }
    };

    startTracking();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [walkId, isActive]);

  return { currentLocation, error };
};
