import type { Credentials, AuthUser, UserRole } from '../model/session';
import type { LoginPayloadDTO, ProfileDTO } from '../../../services/auth';

export const toAuthUser = (dto: ProfileDTO): AuthUser => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  role: toUserRole(dto.role),
  avatar: dto.avatar,
});

const toUserRole = (role: string): UserRole => (role === 'admin' ? 'admin' : 'customer');

export const toLoginPayload = (credentials: Credentials): LoginPayloadDTO => ({
  email: credentials.email,
  password: credentials.password,
});
