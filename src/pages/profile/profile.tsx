import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUser,
  getUserState,
  updateUser
} from '../../services/slices/userSlice/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const { userData, request: isLoading } = useSelector(getUserState);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  }, [userData]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== userData?.name ||
      formValue.email !== userData?.email ||
      !!formValue.password,
    [formValue, userData]
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await dispatch(updateUser(formValue)).unwrap();
      setFormValue({
        name: updatedUser.user.name,
        email: updatedUser.user.email,
        password: ''
      });
      dispatch(getUser());
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) return <Preloader />;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
