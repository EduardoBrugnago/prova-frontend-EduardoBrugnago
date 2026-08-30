import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import LoginForm from '../../components/LoginForm';

function LoginPage() {
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
        </Box>

        <LoginForm onSubmit={() => {}} />
      </Paper>
    </Box>
  );
}

export default LoginPage;
