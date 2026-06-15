/** Matches SignUpResource from backend IAM module */
export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  documentNumber?: string;
  captchaToken?: string;
}

/** Matches SignInResource from backend IAM module */
export interface SignInRequest {
  email: string;
  password: string;
}

/** Matches UserResource from backend IAM module */
export interface UserResource {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[];
}
