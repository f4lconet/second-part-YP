import { FC, memo } from 'react';
import { TModalWrapper } from './type';
import styles from './modal-wrapper.module.css';

export const ModalWrapperUI: FC<TModalWrapper> = memo(
  ({ title, titleStyle, children }) => (
    <>
      <div className={styles.center}>
        <div className={styles.headerCenter}>
          <h3 className={`text ${titleStyle}`}>{title}</h3>
        </div>
        <div>{children}</div>
      </div>
    </>
  )
);
