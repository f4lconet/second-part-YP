import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import styles from './ArticleParamsForm.module.scss';
import { useState, useEffect, useRef, SyntheticEvent, FormEvent } from 'react';
import {
	contentWidthArr,
	fontSizeOptions,
	ArticleStateType,
	OptionType,
	backgroundColors,
	fontFamilyOptions,
	fontColors,
} from 'src/constants/articleProps';
import { Spacing } from '../spacing';
import { Text } from '../text';
import { RadioGroup } from '../radio-group';
import { Select } from '../select';
import { Separator } from '../separator';
import clsx from 'clsx';

export type TArticleProps = {
	defaultArticleState: ArticleStateType;
	changeArticleState: (state: ArticleStateType) => void;
};

export type TConfigurationState = ArticleStateType & {
	opened: boolean;
};

export const ArticleParamsForm = ({
	defaultArticleState,
	changeArticleState,
}: TArticleProps) => {
	const [state, setState] = useState({ ...defaultArticleState, opened: false });
	const formRef = useRef<HTMLDivElement>(null);
	const toggleFormVisibility = () => {
		setState((prev) => ({ ...prev, opened: !prev.opened }));
	};
	const handleEscapeKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			toggleFormVisibility();
		}
	};
	const handleOutsideClick = (e: MouseEvent) => {
		if ( state.opened && formRef.current && !formRef.current.contains(e.target as Node)) {
			toggleFormVisibility();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		document.addEventListener('keydown', handleEscapeKey);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [state.opened]);

	return (
		<>
			<ArrowButton opened={state.opened} onClick={toggleFormVisibility} />
			<aside
				ref={formRef}
				className={clsx(styles.container, {
					[styles.container_open]: state.opened,
				})}>
				<form className={styles.form} onSubmit={(e: FormEvent) => {
					e.preventDefault();
					changeArticleState(state);
					toggleFormVisibility();
				}}>
					<Text children='Задайте параметры' as='h2' size={31} uppercase weight={800} />
					<Spacing size={50} />
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={state.fontFamilyOption}
						onChange={(option) => ((option: OptionType, prop: keyof ArticleStateType) => {
							let modifiedState = { ...state };
							modifiedState[prop] = option;
							setState(modifiedState);
						})(option, 'fontFamilyOption')}
					/>
					<Spacing size={50} />
					<RadioGroup
						name='Размер шрифта'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={state.fontSizeOption}
						onChange={(option) => ((option: OptionType, prop: keyof ArticleStateType) => {
							let modifiedState = { ...state };
							modifiedState[prop] = option;
							setState(modifiedState);
						})(option, 'fontSizeOption')}
					/>
					<Spacing size={50} />
					<Select
						title='Цвет шрифта'
						selected={state.fontColor}
						options={fontColors}
						onChange={(option) => ((option: OptionType, prop: keyof ArticleStateType) => {
							let modifiedState = { ...state };
							modifiedState[prop] = option;
							setState(modifiedState);
						})(option, 'fontColor')}
					/>
					<Spacing size={50} />
					<Separator />
					<Spacing size={50} />
					<Select
						title='Цвет фона'
						selected={state.backgroundColor}
						options={backgroundColors}
						onChange={(option) => ((option: OptionType, prop: keyof ArticleStateType) => {
							let modifiedState = { ...state };
							modifiedState[prop] = option;
							setState(modifiedState);
						})(option, 'backgroundColor')}
					/>
					<Spacing size={50} />
					<Select
						title='Ширина контента'
						selected={state.contentWidth}
						options={contentWidthArr}
						onChange={(option) => ((option: OptionType, prop: keyof ArticleStateType) => {
							let modifiedState = { ...state };
							modifiedState[prop] = option;
							setState(modifiedState);
						})(option, 'contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' onClick={() => {
							const prev = { ...defaultArticleState, opened: false };
							setState(prev);
							changeArticleState(prev);
						}} />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
