import React from 'react';
import {classNames} from 'react-extras';
import exchangeContainer from 'containers/Exchange';
import View from 'components/View';
import SwapList from 'components/SwapList';
import {translate} from '../../translate';
import './Swaps.scss';

const t = translate('exchange');

const swapLimit = 50;

const getOpenOrders = () => exchangeContainer.state.swapHistory.filter(swap => swap.isActive);

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

const OpenOrders = () => {
	const openOrders = getOpenOrders();

	return (
		<SwapList swaps={openOrders} limit={swapLimit} showCancel/>
	);
};

const CurrentPairOpenOrders = () => {
	const {state} = exchangeContainer;

	const filteredData = getOpenOrders().filter(swap =>
		swap.baseCurrency === state.baseCurrency &&
		swap.quoteCurrency === state.quoteCurrency
	);

	return (
		<SwapList swaps={filteredData} limit={swapLimit} showCancel/>
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
						component={OpenOrders}
					/>
					<TabButton
						title={`${state.baseCurrency}/${state.quoteCurrency}`}
						component={CurrentPairOpenOrders}
					/>
				</nav>
			</header>
			<main>
				<TabView component={OpenOrders}/>
				<TabView component={CurrentPairOpenOrders}/>
			</main>
		</div>
	);
};

export default Swaps;
