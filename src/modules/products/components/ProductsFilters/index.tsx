import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

export interface ProductsFiltersProps {
  search: string;
  priceMin: string;
  priceMax: string;
  onSearchChange: (search: string) => void;
  onPriceMinChange: (price: string) => void;
  onPriceMaxChange: (price: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

function ProductsFilters({
  search,
  priceMin,
  priceMax,
  onSearchChange,
  onPriceMinChange,
  onPriceMaxChange,
  onClear,
  disabled = false,
}: ProductsFiltersProps) {
  const hasFilter = search !== '' || priceMin !== '' || priceMax !== '';

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        p: 2,
        mb: 3,
        backgroundColor: 'common.white',
      }}
    >
      <TextField
        label="Buscar por nome"
        value={search}
        disabled={disabled}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{ flex: '1 1 260px' }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        label="Valor minimo"
        type="number"
        value={priceMin}
        disabled={disabled}
        onChange={(event) => onPriceMinChange(event.target.value)}
        sx={{ flex: '0 1 140px' }}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
          htmlInput: { min: 0, step: '0.01' },
        }}
      />

      <TextField
        label="Valor maximo"
        type="number"
        value={priceMax}
        disabled={disabled}
        onChange={(event) => onPriceMaxChange(event.target.value)}
        sx={{ flex: '0 1 140px' }}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
          htmlInput: { min: 0, step: '0.01' },
        }}
      />

      <Box sx={{ ml: 'auto' }}>
        <Button
          color="inherit"
          startIcon={<FilterAltOffIcon />}
          disabled={disabled || !hasFilter}
          onClick={onClear}
        >
          Limpar
        </Button>
      </Box>
    </Paper>
  );
}

export default ProductsFilters;
