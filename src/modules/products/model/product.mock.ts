import type { Product, ProductCategory } from './product';

export const mockCategories: ProductCategory[] = [
  { id: 1, name: 'Periféricos' },
  { id: 2, name: 'Monitores' },
  { id: 3, name: 'Notebooks' },
  { id: 4, name: 'Áudio' },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Teclado mecânico compacto',
    price: 429.9,
    description: 'Teclado 65% com switch tátil e keycaps em PBT.',
    category: mockCategories[0],
  },
  {
    id: 2,
    name: 'Teclado mecânico compacto',
    price: 329.9,
    description: 'Teclado 65% com switch tátil e keycaps em PBT.',
    category: mockCategories[1],
  },
  {
    id: 3,
    name: 'Teclado mecânico compacto',
    price: 129.9,
    description: 'Teclado 65% com switch tátil e keycaps em PBT.',
    category: mockCategories[2],
  },
  {
    id: 4,
    name: 'Teclado mecânico compacto',
    price: 229.9,
    description: 'Teclado 65% com switch tátil e keycaps em PBT.',
    category: mockCategories[3],
  },
];
