export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface UserStats {
  incidentsReported: number;
  memberSince: string;
}
