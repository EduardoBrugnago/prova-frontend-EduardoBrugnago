import { authTokensDtoSchema } from './auth.dto';
import type { AuthTokensDTO } from './auth.dto';
import { authClient } from './client';
import { authEndpoints } from './endpoints';

export async function refreshSession(refreshToken: string): Promise<AuthTokensDTO> {
  const { data } = await authClient.post(authEndpoints.refresh, { refreshToken });
  return authTokensDtoSchema.parse(data);
}
