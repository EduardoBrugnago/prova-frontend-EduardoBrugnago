import { useMemo } from 'react';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import DataTable from '../../../../generic/components/DataTable';
import type { TableColumn } from '../../../../generic/components/DataTable';
import Pagination from '../../../../generic/components/Pagination';
import { formatCurrency } from '../../../../generic/utils';
import type { Product } from '../../model/product';

export interface ProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string | null;
  onRetry?: () => void;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function ProductsTable({
  products,
  isLoading = false,
  isFetching = false,
  error = null,
  onRetry,
  page,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const columns = useMemo<TableColumn<Product>[]>(
    () => [
      {
        key: 'name',
        header: 'Produto',
        render: (product) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              variant="rounded"
              sx={{ width: 36, height: 36, bgcolor: 'primary.light', fontSize: '0.875rem' }}
            >
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {product.description}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        key: 'category',
        header: 'Categoria',
        width: 180,
        render: (product) => <Chip size="small" label={product.category.name} />,
      },
      {
        key: 'price',
        header: 'Preço',
        align: 'right',
        width: 140,
        render: (product) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatCurrency(product.price)}
          </Typography>
        ),
      },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        width: 110,
        render: (product) => (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                aria-label={`Editar ${product.name}`}
                onClick={() => onEdit(product)}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton
                size="small"
                color="error"
                aria-label={`Excluir ${product.name}`}
                onClick={() => onDelete(product)}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <DataTable
      label="Lista de produtos"
      columns={columns}
      rows={products}
      getRowKey={(product) => product.id}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetry}
      emptyMessage="Nenhum produto encontrado com esse filtro."
      skeletonRows={pageSize}
      footer={
        <Pagination
          page={page}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          disabled={isLoading}
        />
      }
    />
  );
}

export default ProductsTable;
