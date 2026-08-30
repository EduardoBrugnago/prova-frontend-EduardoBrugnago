import type { CategoryDTO } from '../../../services/categories';
import type { Category } from '../model/category';

export const toCategory = (dto: CategoryDTO): Category => ({
  slug: dto.slug,
  name: dto.name,
});
