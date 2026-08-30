import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../../modules/auth';
import ProductsPage from '../../modules/products/pages/ProductsPage';
import AppLayout from './AppLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { routePaths } from './routePaths';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={routePaths.login} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={routePaths.products} element={<ProductsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={routePaths.products} replace />} />
    </Routes>
  );
}

export default AppRoutes;
