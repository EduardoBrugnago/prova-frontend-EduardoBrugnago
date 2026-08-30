import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Informe um nome com pelo menos 2 caracteres'),
  price: z
    .string()
    .trim()
    .min(1, 'Informe o preço')
    .refine((value) => Number(value) > 0, 'Informe um preço maior que 0'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().trim().min(10, 'Descreva o produto com pelo menos 10 caracteres'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
