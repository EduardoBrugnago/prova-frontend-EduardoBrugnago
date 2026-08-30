import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import TableSkeleton from '../TableSkeleton';

export interface TableColumn<TRow> {
  key: string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render: (row: TRow) => ReactNode;
}

export interface DataTableProps<TRow> {
  columns: TableColumn<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string | number;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  skeletonRows?: number;
  footer?: ReactNode;
  label?: string;
}

function DataTable<TRow>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  isFetching = false,
  error = null,
  onRetry,
  emptyMessage = 'Nenhum dado encontrado.',
  skeletonRows = 5,
  footer,
  label,
}: DataTableProps<TRow>) {
  const showSkeleton = isLoading && !error;
  const showEmpty = !isLoading && !error && rows.length === 0;

  return (
    <TableContainer sx={{ position: 'relative', backgroundColor: 'common.white' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        {isFetching && !isLoading ? <LinearProgress /> : null}
      </Box>

      <Table aria-label={label} aria-busy={isLoading || isFetching}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align} sx={{ width: column.width }}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {showSkeleton ? (
          <TableSkeleton columns={columns.length} rows={skeletonRows} />
        ) : (
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="error" gutterBottom>
                    {error}
                  </Typography>
                  {onRetry ? (
                    <Button size="small" onClick={onRetry}>
                      Tentar novamente
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : null}

            {showEmpty ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}

            {!error &&
              rows.map((row) => (
                <TableRow key={getRowKey(row)} hover>
                  {columns.map((column) => (
                    <TableCell key={column.key} align={column.align}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>

      {footer ? <Box sx={{ borderTop: 1, borderColor: 'divider' }}>{footer}</Box> : null}
    </TableContainer>
  );
}

export default DataTable;
