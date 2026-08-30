import { useAppSelector } from '../../../app/store/hooks';
import { selectAuthStatus, selectAuthUser } from '../store/authSlice';

export function useSession() {
  const status = useAppSelector(selectAuthStatus);
  const user = useAppSelector(selectAuthUser);

  return {
    status,
    user,
    isAuthenticated: status === 'authenticated',
    isResolving: status === 'idle' || status === 'restoring',
  };
}
