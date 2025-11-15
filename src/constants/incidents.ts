export const INCIDENT_TYPES = {
  THEFT: 'theft',
  HARASSMENT: 'harassment',
  ACCIDENT: 'accident',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  VANDALISM: 'vandalism',
  ASSAULT: 'assault',
  ROBBERY: 'robbery',
  DRUG_ACTIVITY: 'drug_activity',
  NOISE_COMPLAINT: 'noise_complaint',
  TRAFFIC_VIOLATION: 'traffic_violation',
  DOMESTIC_VIOLENCE: 'domestic_violence',
  FRAUD: 'fraud',
  CYBERCRIME: 'cybercrime',
  ENVIRONMENTAL_HAZARD: 'environmental_hazard',
  FIRE_HAZARD: 'fire_hazard',
  OTHER: 'other',
} as const;

export const INCIDENT_SEVERITY = {
  SAFE: 'safe',
  CAUTION: 'caution', 
  DANGER: 'danger',
  CRITICAL: 'critical',
} as const;

export const INCIDENT_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  FLAGGED: 'flagged',
} as const;

export const INCIDENT_TYPE_LABELS = {
  [INCIDENT_TYPES.THEFT]: 'Theft',
  [INCIDENT_TYPES.HARASSMENT]: 'Harassment',
  [INCIDENT_TYPES.ACCIDENT]: 'Accident',
  [INCIDENT_TYPES.SUSPICIOUS_ACTIVITY]: 'Suspicious Activity',
  [INCIDENT_TYPES.VANDALISM]: 'Vandalism',
  [INCIDENT_TYPES.ASSAULT]: 'Assault',
  [INCIDENT_TYPES.ROBBERY]: 'Robbery',
  [INCIDENT_TYPES.DRUG_ACTIVITY]: 'Drug Activity',
  [INCIDENT_TYPES.NOISE_COMPLAINT]: 'Noise Complaint',
  [INCIDENT_TYPES.TRAFFIC_VIOLATION]: 'Traffic Violation',
  [INCIDENT_TYPES.DOMESTIC_VIOLENCE]: 'Domestic Violence',
  [INCIDENT_TYPES.FRAUD]: 'Fraud',
  [INCIDENT_TYPES.CYBERCRIME]: 'Cybercrime',
  [INCIDENT_TYPES.ENVIRONMENTAL_HAZARD]: 'Environmental Hazard',
  [INCIDENT_TYPES.FIRE_HAZARD]: 'Fire Hazard',
  [INCIDENT_TYPES.OTHER]: 'Other',
};

export const SEVERITY_LABELS = {
  [INCIDENT_SEVERITY.SAFE]: 'Safe',
  [INCIDENT_SEVERITY.CAUTION]: 'Caution',
  [INCIDENT_SEVERITY.DANGER]: 'Danger',
  [INCIDENT_SEVERITY.CRITICAL]: 'Critical',
};

export const SEVERITY_COLORS = {
  [INCIDENT_SEVERITY.SAFE]: '#10B981',
  [INCIDENT_SEVERITY.CAUTION]: '#F59E0B', 
  [INCIDENT_SEVERITY.DANGER]: '#F97316',
  [INCIDENT_SEVERITY.CRITICAL]: '#EF4444',
};

export const SEVERITY_DESCRIPTIONS = {
  [INCIDENT_SEVERITY.SAFE]: 'Low risk situation, informational',
  [INCIDENT_SEVERITY.CAUTION]: 'Moderate risk, be aware',
  [INCIDENT_SEVERITY.DANGER]: 'High risk, avoid area',
  [INCIDENT_SEVERITY.CRITICAL]: 'Immediate danger, emergency response needed',
};

export const INCIDENT_TYPE_ICONS = {
  [INCIDENT_TYPES.THEFT]: 'bag-outline',
  [INCIDENT_TYPES.HARASSMENT]: 'person-outline',
  [INCIDENT_TYPES.ACCIDENT]: 'car-outline',
  [INCIDENT_TYPES.SUSPICIOUS_ACTIVITY]: 'eye-outline',
  [INCIDENT_TYPES.VANDALISM]: 'hammer-outline',
  [INCIDENT_TYPES.ASSAULT]: 'warning-outline',
  [INCIDENT_TYPES.ROBBERY]: 'cash-outline',
  [INCIDENT_TYPES.DRUG_ACTIVITY]: 'medical-outline',
  [INCIDENT_TYPES.NOISE_COMPLAINT]: 'volume-high-outline',
  [INCIDENT_TYPES.TRAFFIC_VIOLATION]: 'car-sport-outline',
  [INCIDENT_TYPES.DOMESTIC_VIOLENCE]: 'home-outline',
  [INCIDENT_TYPES.FRAUD]: 'card-outline',
  [INCIDENT_TYPES.CYBERCRIME]: 'phone-portrait-outline',
  [INCIDENT_TYPES.ENVIRONMENTAL_HAZARD]: 'leaf-outline',
  [INCIDENT_TYPES.FIRE_HAZARD]: 'flame-outline',
  [INCIDENT_TYPES.OTHER]: 'ellipsis-horizontal-outline',
};

export type IncidentType = typeof INCIDENT_TYPES[keyof typeof INCIDENT_TYPES];
export type IncidentSeverity = typeof INCIDENT_SEVERITY[keyof typeof INCIDENT_SEVERITY];
export type IncidentStatus = typeof INCIDENT_STATUS[keyof typeof INCIDENT_STATUS];