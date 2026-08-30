import LoginPage from '../modules/auth/pages/LoginPage';
import ProductsPage from '../modules/products/pages/ProductsPage';
import AppProviders from './providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <LoginPage />
    </AppProviders>
  );
}

export default App;
