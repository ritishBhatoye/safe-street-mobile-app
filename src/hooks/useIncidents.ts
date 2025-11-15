import { useState, useCallback } from 'react';
import { 
  useGetNearbyIncidentsQuery,
  useCreateIncidentMutation,
  useGetAllIncidentsQuery,
  useGetIncidentByIdQuery,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
  useConfirmIncidentMutation,
} from '@/store/api/incidentsApi';
import { 
  CreateIncidentRequest, 
  UpdateIncidentRequest,
  GetIncidentsParams,
  IncidentFilters 
} from '@/types/incidents';
import * as Location from 'expo-location';

export const useIncidents = () => {
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);

  // Get user's current location
  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }, []);

  // Mutations
  const [createIncident, createIncidentResult] = useCreateIncidentMutation();
  const [updateIncident, updateIncidentResult] = useUpdateIncidentMutation();
  const [deleteIncident, deleteIncidentResult] = useDeleteIncidentMutation();
  const [confirmIncident, confirmIncidentResult] = useConfirmIncidentMutation();

  // Helper functions
  const createNewIncident = useCallback(async (incidentData: CreateIncidentRequest) => {
    try {
      const result = await createIncident(incidentData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [createIncident]);

  const updateExistingIncident = useCallback(async (updateData: UpdateIncidentRequest) => {
    try {
      const result = await updateIncident(updateData).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [updateIncident]);

  const removeIncident = useCallback(async (id: string) => {
    try {
      await deleteIncident(id).unwrap();
    } catch (error) {
      throw error;
    }
  }, [deleteIncident]);

  const confirmExistingIncident = useCallback(async (id: string) => {
    try {
      const result = await confirmIncident(id).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [confirmIncident]);

  return {
    // Location
    currentLocation,
    getCurrentLocation,
    
    // Filters
    filters,
    setFilters,
    
    // Mutations
    createNewIncident,
    updateExistingIncident,
    removeIncident,
    confirmExistingIncident,
    
    // Mutation states
    createIncidentResult,
    updateIncidentResult,
    deleteIncidentResult,
    confirmIncidentResult,
    
    // Query hooks (to be used directly in components)
    useGetNearbyIncidentsQuery,
    useGetAllIncidentsQuery,
    useGetIncidentByIdQuery,
  };
};

// Hook for nearby incidents with automatic location
export const useNearbyIncidents = (radius: number = 5) => {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get location on mount
  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        lat: locationResult.coords.latitude,
        lng: locationResult.coords.longitude,
      });
      setLocationError(null);
    } catch (error) {
      setLocationError('Failed to get location');
      console.error('Error getting location:', error);
    }
  }, []);

  // Query nearby incidents
  const {
    data: incidents,
    error,
    isLoading,
    refetch,
  } = useGetNearbyIncidentsQuery(
    location ? { ...location, radius } : { lat: 0, lng: 0, radius },
    {
      skip: !location, // Skip query if no location
    }
  );

  return {
    incidents: incidents || [],
    isLoading,
    error: error || locationError,
    refetch,
    getLocation,
    location,
  };
};