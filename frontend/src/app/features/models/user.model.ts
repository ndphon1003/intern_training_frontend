export interface ProfileResponse {
  code: number;
  message: string;
  data: UserInformation;
}

export interface UserInformation {
  authInfoResponse: AuthInfoResponse;
  userProfile: UserProfile;
}

export interface AuthInfoResponse {
  username: string;
  role: string;
  email: string;
  isDeactivate: boolean;
  isDeleted: boolean;
}

export interface UserProfile {
  profileId: string;
  userId: string;

  fullName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  bio: string | null;

  address: string | null;
  city: string | null;
  country: string | null;

  updatedAt: string; // ISO string từ LocalDateTime
}