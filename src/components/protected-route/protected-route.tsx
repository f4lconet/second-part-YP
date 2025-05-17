import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/slices/userSlice/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const data = useSelector(getUserState).userData;
  const isAuthChecked = useSelector(getUserState).isAuthChecked;
  const isAuthenticated = useSelector(getUserState).isAuthenticated;

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (isAuthChecked) {
    return <Preloader />;
  }

  return <Outlet />;
};
