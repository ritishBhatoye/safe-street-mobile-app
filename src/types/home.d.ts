interface NearbyIncidentType {
  id: string;
  title: string;
  type: "incident" | "hazard" | "maintenance" | "other";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  latitude: number;
  longitude: number;
  distance?: number; // in km
  created_at: string;
}

 interface HotspotType {
  location: string;
  latitude: number;
  longitude: number;
  incident_count: number;
  distance?: number; // in km
}

 interface CommunityActivityType {
  new_reports_24h: number;
  confirmations_24h: number;
}

interface SafetyScoreType {
  score: number; // 0-10
  location: string;
  trend: "up" | "down" | "stable";
}
