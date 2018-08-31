import React from 'react';
import {classNames} from 'react-extras';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange';
import tradesContainer from 'containers/Trades';
import View from 'components/View';
import SwapList from 'components/SwapList';
import Link from 'components/Link';
import {translate} from '../../translate';
import './Swaps.scss';

const t = translate('exchange');

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
		<SwapList swaps={openOrders} showCancel/>
	);
};

const CurrentPairOpenOrders = () => {
	const {state} = exchangeContainer;

	const filteredData = getOpenOrders().filter(swap =>
		swap.baseCurrency === state.baseCurrency &&
		swap.quoteCurrency === state.quoteCurrency
	);

	return (
		<SwapList swaps={filteredData} showCancel/>
	);
};

const Swaps = () => {
	const {state} = exchangeContainer;

	return (
		<div className="Exchange--Swaps">
			<header>
				<h3>
					{t('swaps.title')}
					<Link
						className="history-button"
						onClick={() => {
							appContainer.setActiveView('Trades');
							tradesContainer.setActiveView('TradeHistory');
						}}
					>
						{t('swaps.historyButtonTitle')}
					</Link>
				</h3>
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
