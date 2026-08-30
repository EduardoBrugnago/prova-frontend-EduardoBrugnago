import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

import Input from '../../../../generic/components/Input';
import { loginSchema } from '../../model/loginSchema';
import type { LoginFormValues } from '../../model/loginSchema';

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
}
function LoginForm({ onSubmit }: LoginFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <Input
          name="email"
          control={control}
          label="E-mail"
          type="email"
          autoComplete="email"
          fullWidth
          autoFocus
        />

        <Input
          name="password"
          control={control}
          label="Senha"
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete="current-password"
          fullWidth
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

        <Button type="submit" variant="contained" size="large" fullWidth>
          Entrar
        </Button>
      </Stack>
    </Box>
  );
}

export default LoginForm;
