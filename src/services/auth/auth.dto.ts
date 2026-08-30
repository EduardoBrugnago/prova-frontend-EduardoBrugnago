import { z } from 'zod';

export const authTokensDtoSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const profileDtoSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string().catch(''),
});

export type AuthTokensDTO = z.infer<typeof authTokensDtoSchema>;
export type ProfileDTO = z.infer<typeof profileDtoSchema>;

export interface LoginPayloadDTO {
  email: string;
  password: string;
}
