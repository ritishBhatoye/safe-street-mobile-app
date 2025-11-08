import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";


export const homeService = {
  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return location;
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  },

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Get nearby incidents within radius
   */
  async getNearbyIncidents(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<NearbyIncidentType[]> {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Filter by distance and calculate
      const nearby = (data || [])
        .map((report) => ({
          ...report,
          distance: this.calculateDistance(
            latitude,
            longitude,
            report.latitude,
            report.longitude
          ),
        }))
        .filter((report) => report.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      return nearby;
    } catch (error) {
      console.error("Error fetching nearby incidents:", error);
      return [];
    }
  },

  /**
   * Get hotspots (areas with multiple incidents)
   */
  async getHotspots(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<HotspotType[]> {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("location, latitude, longitude")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) throw error;

      // Group by location and count
      const locationMap = new Map<string, HotspotType>();
      
      (data || []).forEach((report) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          report.latitude,
          report.longitude
        );

        if (distance <= radiusKm) {
          const key = report.location;
          if (locationMap.has(key)) {
            const existing = locationMap.get(key)!;
            existing.incident_count++;
          } else {
            locationMap.set(key, {
              location: report.location,
              latitude: report.latitude,
              longitude: report.longitude,
              incident_count: 1,
              distance,
            });
          }
        }
      });

      // Filter hotspots (3+ incidents) and sort
      return Array.from(locationMap.values())
        .filter((hotspot) => hotspot.incident_count >= 3)
        .sort((a, b) => b.incident_count - a.incident_count)
        .slice(0, 3);
    } catch (error) {
      console.error("Error fetching hotspots:", error);
      return [];
    }
  },

  /**
   * Get community activity pulse
   */
  async getCommunityActivity(): Promise<CommunityActivityType> {
    try {
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString();

      const { count: newReports, error: reportsError } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true })
        .gte("created_at", twentyFourHoursAgo);

      if (reportsError) throw reportsError;

      // Mock confirmations for now (can be implemented with a confirmations table)
      const confirmations = Math.floor((newReports || 0) * 1.5);

      return {
        new_reports_24h: newReports || 0,
        confirmations_24h: confirmations,
      };
    } catch (error) {
      console.error("Error fetching community activity:", error);
      return {
        new_reports_24h: 0,
        confirmations_24h: 0,
      };
    }
  },

  /**
   * Calculate safety score based on nearby incidents
   */
  async getSafetyScore(
    latitude: number,
    longitude: number
  ): Promise<SafetyScoreType> {
    try {
      const incidents = await this.getNearbyIncidents(latitude, longitude, 2);
      
      // Calculate score based on incident count and severity
      let baseScore = 10;
      
      incidents.forEach((incident) => {
        const severityWeight = {
          critical: 2,
          high: 1.5,
          medium: 1,
          low: 0.5,
        }[incident.priority];

        const distanceWeight = incident.distance! < 1 ? 1.5 : 1;
        baseScore -= severityWeight * distanceWeight * 0.5;
      });

      const score = Math.max(0, Math.min(10, Math.round(baseScore)));

      // Get location name
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const locationName = location
        ? `${location.city || location.district || "Unknown"}`
        : "Current Location";

      // Determine trend (mock for now)
      const trend = score >= 7 ? "up" : score >= 4 ? "stable" : "down";

      return {
        score,
        location: locationName,
        trend,
      };
    } catch (error) {
      console.error("Error calculating safety score:", error);
      return {
        score: 5,
        location: "Current Location",
        trend: "stable",
      };
    }
  },
};
