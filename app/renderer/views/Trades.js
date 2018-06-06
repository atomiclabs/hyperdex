import React from 'react';
import {classNames} from 'react-extras';
import {Subscribe} from 'unstated';
import exchangeContainer from 'containers/Exchange'; // TODO(sindresorhus): Find a better place to have the SwapDB data, since both the Exchange and Trades view uses it
import tradesContainer from 'containers/Trades';
import View from 'components/View';
import SwapList from 'components/SwapList';
import AppTabView from './TabView';
import './Exchange/Swaps.scss';
import './Trades.scss';

const TabButton = props => (
	<span
		className={
			classNames(
				'button',
				{
					active: tradesContainer.state.activeView === props.component.name,
				}
			)
		}
		onClick={() => {
			tradesContainer.setActiveView(props.component.name);
		}}
	>
		{props.title}
	</span>
);

const TabView = ({component}) => (
	<View component={component} activeView={tradesContainer.state.activeView}/>
);

const OpenOrders = () => {
	const {state} = exchangeContainer;
	const filteredData = state.swapHistory.filter(x => !['completed', 'failed'].includes(x.status));
	return <SwapList swaps={filteredData} showCancel/>;
};

const SwapHistory = () => {
	const {state} = exchangeContainer;
	const filteredData = state.swapHistory.filter(x => ['completed', 'failed'].includes(x.status));
	return <SwapList swaps={filteredData} showCancel/>;
};

const Trades = () => (
	<Subscribe to={[tradesContainer, /* Temp => */exchangeContainer]}>
		{() => (
			<AppTabView title="Trades" className="Trades">
				<header>
					<nav>
						<TabButton
							title="Open Orders"
							component={OpenOrders}
						/>
						<TabButton
							title="Swap History"
							component={SwapHistory}
						/>
					</nav>
				</header>
				<main>
					<TabView component={OpenOrders}/>
					<TabView component={SwapHistory}/>
				</main>
			</AppTabView>
		)}
	</Subscribe>
);

export default Trades;
