import ProductsPage from '../modules/products/pages/ProductsPage';
import AppProviders from './providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <ProductsPage />
    </AppProviders>
  );
}

export default App;
