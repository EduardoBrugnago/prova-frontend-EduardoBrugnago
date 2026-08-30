import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSession } from '../../modules/auth';
import { routePaths } from './routePaths';

interface LocationState {
  from?: { pathname?: string };
}

function PublicRoute() {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  if (isAuthenticated) {
    const state = location.state as LocationState | null;
    return <Navigate to={state?.from?.pathname ?? routePaths.products} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
