import type { Product } from './product';

export type SortField = 'name' | 'category' | 'price' | 'stock';
export type SortDirection = 'asc' | 'desc';

export interface PriceRange {
  priceMin: string;
  priceMax: string;
}

export interface ProductsPage {
  items: Product[];
  total: number;
  hasNextPage: boolean;
}

const toPrice = (value: string): number | null => {
  if (value.trim() === '') return null;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

// a API nao tem parametro de preço, entao essa e a unica regra de filtro que sobrou
// no dominio: nome e ordenaçao vao pro servidor
export function filterByPrice(products: Product[], range: PriceRange): Product[] {
  const min = toPrice(range.priceMin);
  const max = toPrice(range.priceMax);

  return products.filter(
    (product) => (min === null || product.price >= min) && (max === null || product.price <= max),
  );
}

export function paginate(products: Product[], page: number, pageSize: number): ProductsPage {
  const start = (page - 1) * pageSize;

  return {
    items: products.slice(start, start + pageSize),
    total: products.length,
    hasNextPage: products.length > page * pageSize,
  };
}
