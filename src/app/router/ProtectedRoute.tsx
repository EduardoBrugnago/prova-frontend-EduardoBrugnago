import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSession } from '../../modules/auth';
import { routePaths } from './routePaths';

function ProtectedRoute() {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={routePaths.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
