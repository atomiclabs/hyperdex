import React from 'react';
import PropTypes from 'prop-types';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange';
import tradesContainer from 'containers/Trades';
import View from 'components/View';
import SwapList from 'components/SwapList';
import Link from 'components/Link';
import TabButton from 'components/TabButton';
import {translate} from '../../translate';
import './Swaps.scss';

const t = translate('exchange');

// const getOpenOrders = () => appContainer.state.ordersHistory.filter(order => order.status !== 'completed');
const getOpenOrders = () => appContainer.state.ordersHistory.filter(order => order.isOpen);

const TabView = ({component}) => (
	<View component={component} activeView={exchangeContainer.state.activeSwapsView}/>
);

TabView.propTypes = {
	component: PropTypes.elementType.isRequired,
};

const OpenOrders = () => {
	const openOrders = getOpenOrders();

	return (
		<SwapList showCancel swaps={openOrders}/>
	);
};

const CurrentPairOpenOrders = () => {
	const {state} = exchangeContainer;

	const filteredData = getOpenOrders().filter(swap =>
		swap.baseCurrency === state.baseCurrency &&
		swap.quoteCurrency === state.quoteCurrency
	);

	return (
		<SwapList showCancel swaps={filteredData}/>
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
						isActive={state.activeSwapsView === OpenOrders.name}
						onClick={() => exchangeContainer.setActiveSwapsView(OpenOrders.name)}
					>
						{t('swaps.all')}
					</TabButton>
					<TabButton
						isActive={state.activeSwapsView === CurrentPairOpenOrders.name}
						onClick={() => exchangeContainer.setActiveSwapsView(CurrentPairOpenOrders.name)}
					>
						{`${state.baseCurrency}/${state.quoteCurrency}`}
					</TabButton>
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
