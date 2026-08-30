import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../../../app/router/routePaths';
import LoginForm from '../../components/LoginForm';
import { useLogin } from '../../hooks';
import type { LoginFormValues } from '../../model/loginSchema';

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isLoading, error } = useLogin();

  async function handleSubmit(values: LoginFormValues) {
    const signedIn = await signIn(values);

    if (signedIn) {
      navigate(routePaths.products, { replace: true });
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          backgroundColor: 'common.white',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Entrar
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Acesse com a sua conta.
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Credencial de teste: <strong>emilys</strong> / <strong>emilyspass</strong>
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}

        <LoginForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </Paper>
    </Box>
  );
}

export default LoginPage;
