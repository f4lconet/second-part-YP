import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrdersAll,
  getUserState
} from '../../services/slices/userSlice/userSlice';
import { getFeeds } from '../../services/slices/feedSlice/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUserState).userOrders;
  const isLoading = useSelector(getUserState).request;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersAll());
    dispatch(getFeeds());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
