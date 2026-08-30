import { z } from 'zod';

const emailFormat = z.email();

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail')
    .refine((value) => emailFormat.safeParse(value).success, 'Informe um e-mail válido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
