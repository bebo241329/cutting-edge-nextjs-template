import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  UserProfile,
  UserProfileUpdateInput,
} from "./types";

export interface AuthProvider {
  kind: "rest" | "firebase";
  login(input: LoginInput): Promise<AuthResponse>;
  register(input: RegisterInput): Promise<AuthResponse>;
  forgotPassword(input: ForgotPasswordInput): Promise<{ ok: true }>;
  getSession(token: string): Promise<AuthResponse["session"] | null>;
  createUserProfile(input: {
    userId: string;
    email: string;
    fullName: string;
    username: string;
  }): Promise<AuthResponse["session"]>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(
    userId: string,
    updates: UserProfileUpdateInput,
  ): Promise<UserProfile>;
}
