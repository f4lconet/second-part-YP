import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState } from 'react';
import clsx from 'clsx';
import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from './constants/articleProps';
import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	const [styleState, setStyleState] = useState(defaultArticleState);
	const changeStyle = (state: ArticleStateType) => {
		setStyleState(state);
	}
	const onArticleClicked = () => {};
	return (
		<div
			className={clsx(styles.main)}
			style={
				{
					'--font-family': styleState.fontFamilyOption.value,
					'--font-size': styleState.fontSizeOption.value,
					'--font-color': styleState.fontColor.value,
					'--container-width': styleState.contentWidth.value,
					'--bg-color': styleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm defaultArticleState={defaultArticleState} changeArticleState={changeStyle} />
			<Article onClick={onArticleClicked}/>
		</div>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
