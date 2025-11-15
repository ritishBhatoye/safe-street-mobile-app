import { IncidentType, IncidentSeverity, IncidentStatus } from '@/constants/incidents';

export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  photos?: string[];
  reported_by?: string;
  status: IncidentStatus;
  confirmed_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateIncidentRequest {
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  photos?: string[];
}

export interface UpdateIncidentRequest {
  id: string;
  type?: IncidentType;
  severity?: IncidentSeverity;
  title?: string;
  description?: string;
  status?: IncidentStatus;
}

export interface NearbyIncidentsParams {
  lat: number;
  lng: number;
  radius?: number;
}

export interface GetIncidentsParams {
  page?: number;
  limit?: number;
  type?: IncidentType;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
}

export interface IncidentFilters {
  type?: IncidentType[];
  severity?: IncidentSeverity[];
  status?: IncidentStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
}