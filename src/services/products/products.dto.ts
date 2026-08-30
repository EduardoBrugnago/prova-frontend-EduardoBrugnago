import { z } from 'zod';

export const productDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  category: z.string(),
  stock: z.coerce.number().catch(0),
  // ha registro com url quebrada, o catch absorve na borda em vez de derrubar a lista
  thumbnail: z.string().catch(''),
});

export const productListDtoSchema = z.object({
  products: z.array(productDtoSchema),
  total: z.number(),
});

export type ProductDTO = z.infer<typeof productDtoSchema>;

export interface ProductPayloadDTO {
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  thumbnail: string;
}
