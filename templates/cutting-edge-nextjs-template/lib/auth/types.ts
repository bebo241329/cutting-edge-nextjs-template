export type UserRole = "admin" | "manager" | "user";

export type UserProfile = {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  pronouns: string | null;
  bio: string | null;
  lastLoginAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown> | null;
};

export type AuthSession = {
  userId: string;
  email: string;
  role: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  username: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type AuthResponse = {
  sessionToken: string;
  session: AuthSession;
};

export type UserProfileUpdateInput = Partial<
  Omit<UserProfile, "userId" | "email" | "createdAt" | "updatedAt">
>;
