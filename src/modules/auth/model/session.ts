export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type SessionStatus = 'idle' | 'restoring' | 'authenticated' | 'unauthenticated';

export interface Credentials {
  email: string;
  password: string;
}
