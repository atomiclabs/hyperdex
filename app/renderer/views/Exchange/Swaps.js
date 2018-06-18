import React from 'react';
import {classNames} from 'react-extras';
import exchangeContainer from 'containers/Exchange';
import View from 'components/View';
import SwapList from 'components/SwapList';
import {translate} from '../../translate';
import './Swaps.scss';

const t = translate('exchange');

const TabButton = props => (
	<span
		className={
			classNames(
				'button',
				{
					active: exchangeContainer.state.activeSwapsView === props.component.name,
				}
			)
		}
		onClick={() => {
			exchangeContainer.setActiveSwapsView(props.component.name);
		}}
	>
		{props.title}
	</span>
);

const TabView = ({component}) => (
	<View component={component} activeView={exchangeContainer.state.activeSwapsView}/>
);

const All = () => (
	<SwapList swaps={exchangeContainer.state.swapHistory}/>
);

const Split = () => {
	const {state} = exchangeContainer;

	const filteredData = state.swapHistory.filter(x =>
		x.baseCurrency === state.baseCurrency &&
		x.quoteCurrency === state.quoteCurrency
	);

	return (
		<SwapList swaps={filteredData}/>
	);
};

const Swaps = () => {
	const {state} = exchangeContainer;

	return (
		<div className="Exchange--Swaps">
			<header>
				<h3>{t('swaps.title')}</h3>
				<nav>
					<TabButton
						title={t('swaps.all')}
						component={All}
					/>
					<TabButton
						title={`${state.baseCurrency}/${state.quoteCurrency}`}
						component={Split}
					/>
				</nav>
			</header>
			<main>
				<TabView component={All}/>
				<TabView component={Split}/>
			</main>
		</div>
	);
};

export default Swaps;
