export interface ProductCategory {
  slug: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  stock: number;
  thumbnail: string;
}
