import React from 'react';
import {classNames} from 'react-extras';
import {format as formatDate} from 'date-fns';
import exchangeContainer from 'containers/Exchange';
import View from 'components/View';
import SwapDetails from './SwapDetails';
import './Swaps.scss';

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

const Empty = () => (
	<div className="Empty">
		<p>No swaps yet</p>
	</div>
);

const SwapItem = ({swap}) => (
	<div className="row">
		<div className="timestamp">{formatDate(swap.timeStarted, 'HH:mm DD.MM')}</div>
		<div className="pairs">{swap.baseCurrency}/{swap.quoteCurrency}</div>
		<div className="sell-amount">-{swap.broadcast.quoteCurrencyAmount} {swap.quoteCurrency}</div>
		<div className="buy-amount">+{swap.broadcast.baseCurrencyAmount} {swap.baseCurrency}</div>
		<div className="status">
			<div className="status__icon" data-status={swap.status}>{swap.statusFormatted}</div>
		</div>
		<div className="view">
			<SwapDetails swap={swap}/>
		</div>
	</div>
);

const SwapList = ({swaps}) => {
	if (swaps.length === 0) {
		return <Empty/>;
	}

	return (
		<div className="SwapList">
			{
				swaps.map(swap => (
					<SwapItem key={swap.uuid} swap={swap}/>
				))
			}
		</div>
	);
};

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
				<h3>Swaps</h3>
				<nav>
					<TabButton
						title="All"
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
