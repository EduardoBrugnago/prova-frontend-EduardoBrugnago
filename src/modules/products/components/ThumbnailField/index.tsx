import { useRef } from 'react';
import type { ChangeEvent } from 'react';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { useController } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import type { ProductFormValues } from '../../model/productSchema';

export interface ThumbnailFieldProps {
  control: Control<ProductFormValues>;
  disabled?: boolean;
}

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });

const hiddenInput = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

function ThumbnailField({ control, disabled = false }: ThumbnailFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { field, fieldState } = useController({ name: 'thumbnail', control });

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // limpa pra permitir escolher o mesmo arquivo de novo depois de remover
    event.target.value = '';

    if (file) {
      field.onChange(await toDataUrl(file));
    }
  }

  return (
    <FormControl error={Boolean(fieldState.error)} disabled={disabled}>
      <FormLabel htmlFor="product-thumbnail">Imagem</FormLabel>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
        <Avatar
          variant="rounded"
          src={field.value || undefined}
          alt=""
          sx={{ width: 64, height: 64, bgcolor: 'background.default', color: 'text.disabled' }}
        >
          <ImageOutlinedIcon fontSize="small" />
        </Avatar>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {field.value ? 'Trocar imagem' : 'Selecionar imagem'}
          </Button>

          {field.value ? (
            <Button
              size="small"
              color="inherit"
              disabled={disabled}
              onClick={() => field.onChange('')}
            >
              Remover
            </Button>
          ) : null}
        </Box>
      </Box>

      <Box
        component="input"
        ref={inputRef}
        id="product-thumbnail"
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleChange}
        sx={hiddenInput}
      />

      <FormHelperText>{fieldState.error?.message ?? 'Opcional'}</FormHelperText>
    </FormControl>
  );
}

export default ThumbnailField;
