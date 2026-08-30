import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export interface PaginationProps {
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

function Pagination({
  page,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  disabled = false,
}: PaginationProps) {
  const hasPreviousPage = page > 1;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        px: 2,
        py: 1.5,
      }}
    >
      {onPageSizeChange ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" component="label" htmlFor="page-size">
            Itens por página
          </Typography>
          <Select
            id="page-size"
            size="small"
            value={pageSize}
            disabled={disabled}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : (
        <span />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Página {page}
        </Typography>
        <IconButton
          size="small"
          aria-label="Página anterior"
          disabled={disabled || !hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Próxima página"
          disabled={disabled || !hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Pagination;
