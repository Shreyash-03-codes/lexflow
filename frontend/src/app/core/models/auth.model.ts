export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  userId?: string;
}

export type Role = 'ADMIN' | 'LAWYER' | 'CLIENT';

export interface JwtPayload {
  sub: string;
  role: Role;
  name: string;
  exp: number;
}
