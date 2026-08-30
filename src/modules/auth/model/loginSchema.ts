import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail').pipe(z.email('Informe um e-mail válido')),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
