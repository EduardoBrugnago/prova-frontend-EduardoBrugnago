import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

import Input from '../../../../generic/components/Input';
import { loginSchema } from '../../model/loginSchema';
import type { LoginFormValues } from '../../model/loginSchema';

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting?: boolean;
}
function LoginForm({ onSubmit, isSubmitting = false }: LoginFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <Input
          name="username"
          control={control}
          label="Usuário"
          autoComplete="username"
          fullWidth
          autoFocus
          disabled={isSubmitting}
        />

        <Input
          name="password"
          control={control}
          label="Senha"
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete="current-password"
          fullWidth
          disabled={isSubmitting}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setIsPasswordVisible((current) => !current)}
                  >
                    {isPasswordVisible ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Entrar
        </Button>
      </Stack>
    </Box>
  );
}

export default LoginForm;
