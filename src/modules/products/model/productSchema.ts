import { z } from 'zod';

const urlFormat = z.url();

const isUrl = (value: string) => urlFormat.safeParse(value).success;
const isDataImage = (value: string) => value.startsWith('data:image/');

// isso da uma imagem de uns 512 KB
const MAX_THUMBNAIL_CHARS = 700_000;

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Informe um nome com pelo menos 2 caracteres'),
  price: z
    .string()
    .trim()
    .min(1, 'Informe o preço')
    .refine((value) => Number(value) > 0, 'Informe um preço maior que 0'),
  category: z.string().min(1, 'Selecione uma categoria'),
  stock: z
    .string()
    .trim()
    .min(1, 'Informe o estoque')
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
      'Informe um estoque inteiro, a partir de 0',
    ),
  description: z.string().trim().min(10, 'Descreva o produto com pelo menos 10 caracteres'),
  thumbnail: z
    .string()
    .trim()
    .refine((value) => value === '' || isDataImage(value) || isUrl(value), 'Selecione uma imagem')
    .refine(
      (value) => value.length <= MAX_THUMBNAIL_CHARS,
      'Imagem muito grande. Escolha uma com até 512 KB.',
    ),
});

export type ProductFormValues = z.infer<typeof productSchema>;
