import { z } from 'zod';

export const authTokensDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const profileDtoSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().catch(''),
});

export type AuthTokensDTO = z.infer<typeof authTokensDtoSchema>;
export type ProfileDTO = z.infer<typeof profileDtoSchema>;

export interface LoginPayloadDTO {
  username: string;
  password: string;
}
