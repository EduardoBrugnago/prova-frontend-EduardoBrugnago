import type { LoginPayloadDTO, ProfileDTO } from '../../../services/auth';
import type { AuthUser, Credentials } from '../model/session';

export const toAuthUser = (dto: ProfileDTO): AuthUser => ({
  id: dto.id,
  name: `${dto.firstName} ${dto.lastName}`.trim(),
  username: dto.username,
  email: dto.email,
  avatar: dto.image,
});

export const toLoginPayload = (credentials: Credentials): LoginPayloadDTO => ({
  username: credentials.username,
  password: credentials.password,
});
