import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

import Input from '../../../../generic/components/Input';
import type { Product, ProductCategory } from '../../model/product';
import { productSchema } from '../../model/productSchema';
import type { ProductFormValues } from '../../model/productSchema';

const emptyValues: ProductFormValues = {
  name: '',
  price: '',
  categoryId: '',
  description: '',
};

function toFormValues(product: Product | null): ProductFormValues {
  if (!product) {
    return emptyValues;
  }

  return {
    name: product.name,
    price: String(product.price),
    categoryId: String(product.category.id),
    description: product.description,
  };
}

export interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  categories: ProductCategory[];
  isSubmitting?: boolean;
  onSubmit: (values: ProductFormValues) => void;
  onClose: () => void;
}

function ProductFormDialog({
  open,
  product,
  categories,
  isSubmitting = false,
  onSubmit,
  onClose,
}: ProductFormDialogProps) {
  const { control, handleSubmit, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(product));
    }
  }, [open, product, reset]);

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="product-form-title"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle id="product-form-title">
          {product ? 'Editar produto' : 'Novo produto'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Input name="name" control={control} label="Nome" fullWidth autoFocus />

            <Input
              name="price"
              control={control}
              label="Preço"
              type="number"
              fullWidth
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
                htmlInput: { min: 0, step: '0.01' },
              }}
            />

            <Input name="categoryId" control={control} label="Categoria" select fullWidth>
              {categories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </Input>

            <Input
              name="description"
              control={control}
              label="Descrição"
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ProductFormDialog;
