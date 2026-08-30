export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
}

export type SessionStatus = 'idle' | 'restoring' | 'authenticated' | 'unauthenticated';

export interface Credentials {
  username: string;
  password: string;
}
