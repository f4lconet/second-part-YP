import { useState } from 'react';
import clsx from 'clsx';
import arrow from 'src/images/arrow.svg';

import styles from './ArrowButton.module.scss';

/** Функция для обработки открытия/закрытия формы */
export type OnClick = () => void;

export type TArrowButtonProps = {
	onClick?: OnClick,
	opened: boolean
}

export const ArrowButton = ({onClick, opened} : TArrowButtonProps) => {
	return (
		/* Не забываем указаывать role и aria-label атрибуты для интерактивных элементов */
		<div
			role='button'
			aria-label='Открыть/Закрыть форму параметров статьи'
			tabIndex={0}
			className={clsx(styles.container, {[styles.container_open]: opened})}
			onClick={onClick}
		>
			<img
				src={arrow}
				alt='иконка стрелочки'
				className={clsx(styles.arrow, {[styles.arrow_open]: opened})}
			/>
		</div>
	);
};
