import { useCallback, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ConfirmDialog from '../../../../generic/components/ConfirmDialog';
import { useDisclosure } from '../../../../generic/hooks';
import ProductFormDialog from '../../components/ProductFormDialog';
import ProductsFilters, { ALL_CATEGORIES } from '../../components/ProductsFilters';
import type { CategoryFilter } from '../../components/ProductsFilters';
import ProductsTable from '../../components/ProductsTable';
import type { Product } from '../../model/product';
import { mockCategories, mockProducts } from '../../model/product.mock';

function ProductsPage() {
  const products = mockProducts;

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryFilter>(ALL_CATEGORIES);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const formDialog = useDisclosure<Product>();
  const deleteDialog = useDisclosure<Product>();

  const handleCreate = useCallback(() => formDialog.open(), [formDialog]);

  const handleEdit = useCallback((product: Product) => formDialog.open(product), [formDialog]);

  const handleDelete = useCallback(
    (product: Product) => deleteDialog.open(product),
    [deleteDialog],
  );

  const handleConfirmDelete = useCallback(() => {
    const removing = deleteDialog.data;

    if (!removing) {
      return;
    }
  }, [deleteDialog]);

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
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
          <Box>
            <Typography variant="h2" component="h1" gutterBottom>
              Produtos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {products.length} produto(s) no resultado atual
            </Typography>
          </Box>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Novo produto
          </Button>
        </Box>

        <ProductsFilters
          search={search}
          categoryId={categoryId}
          categories={mockCategories}
          onSearchChange={setSearch}
          onCategoryChange={() => {}}
          onClear={() => {}}
          disabled={false}
        />

        <ProductsTable
          products={products}
          isLoading={false}
          isFetching={false}
          page={page}
          pageSize={pageSize}
          hasNextPage={true}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ProductFormDialog
          open={formDialog.isOpen}
          product={formDialog.data}
          categories={mockCategories}
          isSubmitting={false}
          onSubmit={() => {}}
          onClose={formDialog.close}
        />

        <ConfirmDialog
          open={deleteDialog.isOpen}
          title="Excluir produto"
          description={`O produto "${deleteDialog.data?.name ?? ''}" vai ser removido permanentemente. Tem certeza que deseja continuar?`}
          confirmLabel="Excluir"
          confirmColor="error"
          isLoading={false}
          onConfirm={handleConfirmDelete}
          onClose={deleteDialog.close}
        />
      </Container>
    </Box>
  );
}

export default ProductsPage;
