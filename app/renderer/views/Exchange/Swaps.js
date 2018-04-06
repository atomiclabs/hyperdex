import React from 'react';
import {classNames} from 'react-extras';
import {format as formatDate} from 'date-fns';
import exchangeContainer from 'containers/Exchange';
import View from 'components/View';
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

const SwapItem = ({swap}) => {
	let statusString = swap.status;

	if (swap.status === 'swapping') {
		const flags = ['myfee', 'bobdeposit', 'alicepayment', 'bobpayment'];
		const swapProgress = swap.flags.reduce((prevFlagLevel, flag) => {
			const newFlagLevel = flags.indexOf(flag) + 1;

			return Math.max(prevFlagLevel, newFlagLevel);
		}, 0);

		statusString = `swap ${swapProgress}/${flags.length}`;
	}

	return (
		<tr>
			<td className="timestamp">{formatDate(swap.timeStarted, 'HH:mm DD.MM')}</td>
			<td className="pairs">{swap.baseCurrency}/{swap.quoteCurrency}</td>
			<td className="sell-amount">+{swap.quoteCurrencyAmount} {swap.quoteCurrency}</td>
			<td className="buy-amount">-{swap.baseCurrencyAmount} {swap.baseCurrency}</td>
			<td className="status">
				<div className="status__icon" data-status={swap.status}>{statusString}</div>
			</td>
			<td className="view">
				<button type="button" className="view__button">View</button>
			</td>
		</tr>
	);
};

const SwapList = ({swaps}) => {
	if (swaps.length === 0) {
		return <Empty/>;
	}

	return (
		<div className="SwapList">
			<table>
				<tbody>
					{
						swaps.map(swap => (
							<SwapItem key={JSON.stringify(swap)} swap={swap}/>
						))
					}
				</tbody>
			</table>
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
					<TabButton title="All" component={All}/>
					<TabButton title={`${state.baseCurrency}/${state.quoteCurrency}`} component={Split}/>
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
