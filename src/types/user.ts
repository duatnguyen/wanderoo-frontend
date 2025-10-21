export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: "light" | "dark";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UserDashboardData {
  profile: UserProfile;
  recentActivities: any[];
  notifications: any[];
}
