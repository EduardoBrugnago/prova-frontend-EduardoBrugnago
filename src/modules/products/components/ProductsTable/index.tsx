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
import type { SortDirection, SortField } from '../../model/product.rules';

export interface ProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string | null;
  onRetry?: () => void;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  sortBy?: SortField | null;
  sortDirection?: SortDirection;
  onSortChange?: (field: SortField) => void;
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
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  sortBy = null,
  sortDirection = 'asc',
  onSortChange,
}: ProductsTableProps) {
  const columns = useMemo<TableColumn<Product>[]>(
    () => [
      {
        key: 'name',
        header: 'Produto',
        sortKey: 'name',
        width: '45%',
        render: (product) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              variant="rounded"
              src={product.thumbnail}
              alt=""
              sx={{
                width: 90,
                height: 90,
                flexShrink: 0,
                bgcolor: 'background.default',
                fontSize: '0.875rem',
              }}
            >
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                }}
              >
                {product.description}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        key: 'category',
        header: 'Categoria',
        sortKey: 'category',
        width: 180,
        render: (product) => <Chip size="small" label={product.category.name} />,
      },
      {
        key: 'price',
        header: 'Preço',
        sortKey: 'price',
        align: 'right',
        width: 140,
        render: (product) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatCurrency(product.price)}
          </Typography>
        ),
      },
      {
        key: 'stock',
        header: 'Estoque',
        sortKey: 'stock',
        align: 'right',
        width: 110,
        render: (product) => (
          <Typography
            variant="body2"
            color={product.stock === 0 ? 'error' : 'text.primary'}
            sx={{ fontWeight: product.stock === 0 ? 600 : 400 }}
          >
            {product.stock}
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
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={onSortChange ? (key) => onSortChange(key as SortField) : undefined}
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
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          disabled={isLoading}
        />
      }
    />
  );
}

export default ProductsTable;
