import { z } from 'zod';

export const categoryDtoSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const categoryDtoListSchema = z.array(categoryDtoSchema);

export type CategoryDTO = z.infer<typeof categoryDtoSchema>;
