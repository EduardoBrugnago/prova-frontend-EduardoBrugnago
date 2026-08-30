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
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

function Pagination({
  page,
  pageSize,
  hasNextPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  disabled = false,
}: PaginationProps) {
  const hasPreviousPage = page > 1;
  // a pagina atual entra na lista mesmo se o total encolheu, senao o Select fica sem valor
  const pageOptions =
    totalPages === undefined
      ? []
      : Array.from({ length: Math.max(totalPages, page) }, (_, index) => index + 1);

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
          <Typography variant="body2" color="text.secondary" component="span" id="page-size-label">
            Itens por página
          </Typography>
          <Select
            id="page-size"
            labelId="page-size-label"
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
        {totalPages === undefined ? (
          <Typography variant="body2" color="text.secondary">
            Página {page}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" component="span" id="page-label">
              Página
            </Typography>

            <Select
              id="page"
              labelId="page-label"
              size="small"
              value={page}
              disabled={disabled}
              onChange={(event) => onPageChange(Number(event.target.value))}
            >
              {pageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="body2" color="text.secondary">
              de {totalPages}
            </Typography>
          </Box>
        )}
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
