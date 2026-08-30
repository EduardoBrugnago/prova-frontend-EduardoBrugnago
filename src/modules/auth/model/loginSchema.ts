import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(3, 'Informe um usuário com pelo menos 3 caracteres'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
