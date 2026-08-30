import { useCallback } from 'react';

import { useToast } from '../../../app/providers/useToast';
import { isAppError } from '../../../services/api';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../../../services/products';
import { toProductPayload } from '../mappers/product.mapper';
import type { Product } from '../model/product';
import type { ProductFormValues } from '../model/productSchema';

export function useProductMutations() {
  const toast = useToast();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const save = useCallback(
    async (values: ProductFormValues, editing: Product | null): Promise<boolean> => {
      const payload = toProductPayload(values);

      try {
        if (!editing) {
          await createProduct(payload).unwrap();
          toast.success('Produto cadastrado com sucesso.');
          return true;
        }

        await updateProduct({ id: editing.id, ...payload }).unwrap();
        toast.success('Produto atualizado com sucesso.');
        return true;
      } catch (caught) {
        toast.error(isAppError(caught) ? caught.message : 'Não foi possível salvar o produto.');
        return false;
      }
    },
    [createProduct, updateProduct, toast],
  );

  const remove = useCallback(
    async (product: Product): Promise<boolean> => {
      try {
        await deleteProduct(product.id).unwrap();
        toast.success('Produto excluído com sucesso.');
        return true;
      } catch (caught) {
        toast.error(isAppError(caught) ? caught.message : 'Não foi possível excluir o produto.');
        return false;
      }
    },
    [deleteProduct, toast],
  );

  return { save, remove, isSaving: isCreating || isUpdating, isDeleting };
}
