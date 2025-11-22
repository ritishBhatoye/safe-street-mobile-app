type WalkStatus = 'active' | 'completed' | 'cancelled' | 'alert';
type AlertType = 'stopped' | 'deviated' | 'timeout' | 'sos';
type CheckpointType = 'started' | 'halfway' | 'arrived' | 'safe';

interface Walk {
  id: string;
  user_id: string;
  
  // Start
  start_address?: string;
  start_lat?: number;
  start_lng?: number;
  
  // Destination
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  
  // Journey
  estimated_duration?: number;
  estimated_distance?: number;
  
  // Status
  status: WalkStatus;
  
  // Last known location (updated in real-time)
  last_lat?: number;
  last_lng?: number;
  last_location_update?: string;
  
  // Timestamps
  started_at: string;
  completed_at?: string;
  expected_arrival?: string;
  created_at: string;
  updated_at: string;
}

interface WalkWatcher {
  id: string;
  walk_id: string;
  watcher_user_id?: string;
  watcher_name?: string;
  watcher_phone?: string;
  share_token?: string;
  created_at: string;
}

interface WalkAlert {
  id: string;
  walk_id: string;
  alert_type: AlertType;
  message: string;
  resolved: boolean;
  created_at: string;
}

interface WalkCheckpoint {
  id: string;
  walk_id: string;
  checkpoint_type: CheckpointType;
  lat?: number;
  lng?: number;
  created_at: string;
}

interface LiveLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

interface CreateWalkRequest {
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  estimated_duration?: number;
  watchers?: {
    watcher_name: string;
    watcher_phone: string;
  }[];
}

interface StartWalkRequest {
  walk_id: string;
  start_lat: number;
  start_lng: number;
  start_address?: string;
}
