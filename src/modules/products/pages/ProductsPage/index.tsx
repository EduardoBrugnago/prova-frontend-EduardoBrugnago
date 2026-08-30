import { useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ConfirmDialog from '../../../../generic/components/ConfirmDialog';
import { useCategoryOptions } from '../../../categories';
import { useDisclosure } from '../../../../generic/hooks';
import ProductFormDialog from '../../components/ProductFormDialog';
import ProductsFilters from '../../components/ProductsFilters';
import ProductsTable from '../../components/ProductsTable';
import { useProductFilters, useProductMutations, useProductsList } from '../../hooks';
import type { Product } from '../../model/product';
import type { ProductFormValues } from '../../model/productSchema';

function ProductsPage() {
  const { filters, setName, setPriceMin, setPriceMax, setSort, setPage, setPageSize, clear } =
    useProductFilters();
  const { categories } = useCategoryOptions();
  const { products, hasNextPage, totalPages, isLoading, isFetching, error, refetch } =
    useProductsList();
  const { save, remove, isSaving, isDeleting } = useProductMutations();

  const formDialog = useDisclosure<Product>();
  const deleteDialog = useDisclosure<Product>();

  const handleSave = useCallback(
    async (values: ProductFormValues) => {
      const saved = await save(values, formDialog.data);

      if (saved) {
        formDialog.close();
      }
    },
    [save, formDialog],
  );

  const handleConfirmDelete = useCallback(async () => {
    const removing = deleteDialog.data;

    if (!removing) {
      return;
    }

    const removed = await remove(removing);

    if (removed) {
      if (products.length === 1 && filters.page > 1) {
        setPage(filters.page - 1);
      }

      deleteDialog.close();
    }
  }, [remove, deleteDialog, products.length, filters.page, setPage]);

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h2" component="h1">
            Produtos
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => formDialog.open()}>
            Novo produto
          </Button>
        </Box>

        <ProductsFilters
          search={filters.name}
          priceMin={filters.priceMin}
          priceMax={filters.priceMax}
          onSearchChange={setName}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          onClear={clear}
        />

        <ProductsTable
          products={products}
          isLoading={isLoading}
          isFetching={isFetching}
          error={error}
          onRetry={refetch}
          page={filters.page}
          pageSize={filters.pageSize}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSortChange={setSort}
          onEdit={formDialog.open}
          onDelete={deleteDialog.open}
        />

        <ProductFormDialog
          open={formDialog.isOpen}
          product={formDialog.data}
          categories={categories}
          isSubmitting={isSaving}
          onSubmit={handleSave}
          onClose={formDialog.close}
        />

        <ConfirmDialog
          open={deleteDialog.isOpen}
          title="Excluir produto"
          description={`O produto "${deleteDialog.data?.name ?? ''}" vai ser removido permanentemente. Tem certeza que deseja continuar?`}
          confirmLabel="Excluir"
          confirmColor="error"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={deleteDialog.close}
        />
      </Container>
    </Box>
  );
}

export default ProductsPage;
