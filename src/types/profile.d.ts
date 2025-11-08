 interface UserProfileType {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

 interface ProfileUpdateDataType {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

interface UserStatsType {
  incidentsReported: number;
  memberSince: string;
}
