/** Matches AuthenticatedUserResource from backend IAM module */
export interface AuthUser {
  id: number;
  email: string;
  token: string;
  roles: string[];
}
