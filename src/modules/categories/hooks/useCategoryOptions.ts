import { useMemo } from 'react';

import { useListCategoriesQuery } from '../../../services/categories';
import { toCategory } from '../mappers/category.mapper';

// quem consome e o filtro de produto e o formulario. e o unico ponto de composicao
// entre os dois modulos, e passa pelo index publico de cada um.
export function useCategoryOptions() {
  const { data, isLoading, error } = useListCategoriesQuery();

  const categories = useMemo(() => data?.map(toCategory) ?? [], [data]);

  const categoryNames = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.slug, category.name])),
    [categories],
  );

  return { categories, categoryNames, isLoading, error };
}
