import type {
  ProductDTO,
  ProductPayloadDTO,
  ProductsQueryParams,
} from '../../../services/products';
import type { Product } from '../model/product';
import type { SortField } from '../model/product.rules';
import type { ProductFormValues } from '../model/productSchema';
import type { ProductsFiltersState } from '../store/productsFilters.slice';

const nameFromSlug = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const toProduct = (dto: ProductDTO, categoryName?: string): Product => ({
  id: dto.id,
  name: dto.title,
  price: dto.price,
  description: dto.description,
  category: { slug: dto.category, name: categoryName ?? nameFromSlug(dto.category) },
  stock: dto.stock,
  thumbnail: dto.thumbnail,
});

export const toProductPayload = (values: ProductFormValues): ProductPayloadDTO => ({
  title: values.name,
  price: Number(values.price),
  description: values.description,
  category: values.category,
  stock: Number(values.stock),
  thumbnail: values.thumbnail,
});

const sortFieldToDto: Record<SortField, 'title' | 'category' | 'price' | 'stock'> = {
  name: 'title',
  // a API ordena pelo slug; como o nome exibido e o slug em title case, a ordem bate
  category: 'category',
  price: 'price',
  stock: 'stock',
};

export const toQueryParams = (filters: ProductsFiltersState): ProductsQueryParams => ({
  q: filters.name.trim() || undefined,
  sortBy: filters.sortBy ? sortFieldToDto[filters.sortBy] : undefined,
  order: filters.sortBy ? filters.sortDirection : undefined,
});
