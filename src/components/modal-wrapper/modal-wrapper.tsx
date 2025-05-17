import { TWrapper } from './type';
import { FC, memo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ModalWrapperUI } from '../ui/modal-wrapper';

export const ModalWrapper: FC<TWrapper> = memo(({ title, children }) => {
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');
  const location = useLocation();

  useEffect(() => {
    if (/feed|profile/i.test(location.pathname)) {
      setTitleStyle('text_type_digits-default');
    }
  }, []);

  return (
    <>
      <ModalWrapperUI
        title={title}
        titleStyle={titleStyle}
        children={children}
      />
    </>
  );
});
