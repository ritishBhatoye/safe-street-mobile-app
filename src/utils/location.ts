import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface AddressInfo {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export class LocationService {
  static async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async getCurrentPosition(): Promise<LocationCoords> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current position:', error);
      throw new Error('Failed to get current location');
    }
  }

  static async reverseGeocode(coords: LocationCoords): Promise<AddressInfo> {
    try {
      const [result] = await Location.reverseGeocodeAsync(coords);
      
      if (!result) {
        return {};
      }

      return {
        address: [result.streetNumber, result.street].filter(Boolean).join(' '),
        city: result.city || result.subregion,
        state: result.region,
        country: result.country,
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return {};
    }
  }

  static async geocode(address: string): Promise<LocationCoords | null> {
    try {
      const [result] = await Location.geocodeAsync(address);
      
      if (!result) {
        return null;
      }

      return {
        latitude: result.latitude,
        longitude: result.longitude,
      };
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  static calculateDistance(
    coord1: LocationCoords,
    coord2: LocationCoords
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) *
        Math.cos(this.toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  static isLocationValid(coords: LocationCoords): boolean {
    return (
      coords.latitude >= -90 &&
      coords.latitude <= 90 &&
      coords.longitude >= -180 &&
      coords.longitude <= 180
    );
  }
}