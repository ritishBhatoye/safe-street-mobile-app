interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

interface UserStats {
  incidentsReported: number;
  memberSince: string;
}
