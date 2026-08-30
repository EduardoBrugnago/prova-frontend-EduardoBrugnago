import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { ProductCategory } from '../../model/product';

export const ALL_CATEGORIES = 'all';

export type CategoryFilter = number | typeof ALL_CATEGORIES;

export interface ProductsFiltersProps {
  search: string;
  categoryId: CategoryFilter;
  categories: ProductCategory[];
  onSearchChange: (search: string) => void;
  onCategoryChange: (categoryId: CategoryFilter) => void;
  onClear: () => void;
  disabled?: boolean;
}

function ProductsFilters({
  search,
  categoryId,
  categories,
  onSearchChange,
  onCategoryChange,
  onClear,
  disabled = false,
}: ProductsFiltersProps) {
  const hasFilter = search !== '' || categoryId !== ALL_CATEGORIES;

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
        select
        label="Categoria"
        value={categoryId}
        disabled={disabled}
        onChange={(event) =>
          onCategoryChange(
            event.target.value === ALL_CATEGORIES ? ALL_CATEGORIES : Number(event.target.value),
          )
        }
        sx={{ flex: '0 1 220px' }}
      >
        <MenuItem value={ALL_CATEGORIES}>Todas</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>

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
