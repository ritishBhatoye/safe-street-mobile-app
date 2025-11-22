export const WALK_CONFIG = {
  // Location tracking
  LOCATION_UPDATE_INTERVAL: 10000, // 10 seconds
  LOCATION_ACCURACY: 'high' as const,
  
  // Alert thresholds
  STOPPED_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  DEVIATION_THRESHOLD: 200, // 200 meters off route
  TIMEOUT_BUFFER: 15 * 60 * 1000, // 15 minutes after ETA
  
  // Realtime channel
  CHANNEL_PREFIX: 'walk:',
  
  // Checkpoints
  HALFWAY_THRESHOLD: 0.5, // 50% of journey
};

export const ALERT_MESSAGES = {
  stopped: 'User has stopped moving for more than 5 minutes',
  deviated: 'User has deviated from the planned route',
  timeout: 'User has not reached destination within expected time',
  sos: 'Emergency SOS triggered by user',
};

export const WALK_STATUS_LABELS = {
  active: 'Walking',
  completed: 'Completed',
  cancelled: 'Cancelled',
  alert: 'Alert',
};

export const WALK_STATUS_COLORS = {
  active: '#3B82F6',
  completed: '#22C55E',
  cancelled: '#6B7280',
  alert: '#EF4444',
};
