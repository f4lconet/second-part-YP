import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeedState,
  getFeeds
} from '../../services/slices/feedSlice/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedState).orders;
  const isLoading = useSelector(getFeedState).loading;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  if (!orders.length || isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
