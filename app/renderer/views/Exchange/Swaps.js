import React from 'react';
import {classNames} from 'react-extras';
import {format as formatDate} from 'date-fns';
import {exchangeContainer} from 'containers/Exchange';
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

const SwapItem = ({swap}) => (
	<tr>
		<td className="timestamp">{formatDate(swap.timestamp, 'HH:m DD.MM')}</td>
		<td className="pairs">{swap.baseCurrency}/{swap.quoteCurrency}</td>
		<td className="sell-amount">-{swap.sellAmount}</td>
		<td className="buy-amount">+{swap.buyAmount}</td>
		<td className="status">
			<div className="status__icon" data-status={swap.status}>{swap.status}</div>
		</td>
		<td className="view">
			<button type="button" className="view__button">View</button>
		</td>
	</tr>
);

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

/// TODO: Temp data
const data = [
	{
		timestamp: new Date('16:10 28 Feb 2018'),
		baseCurrency: 'KMD',
		quoteCurrency: 'BTC',
		sellAmount: 1000.03,
		buyAmount: 243434.55,
		status: 'started',
	},
	{
		timestamp: new Date('11:10 28 Feb 2018'),
		baseCurrency: 'LTC',
		quoteCurrency: 'BTC',
		sellAmount: 2.03,
		buyAmount: 234.55,
		status: 'cancelled',
	},
	{
		timestamp: new Date('09:10 28 Feb 2018'),
		baseCurrency: 'KMD',
		quoteCurrency: 'LTC',
		sellAmount: 3.03,
		buyAmount: 534.45,
		status: 'completed',
	},
];

const All = () => (
	<SwapList swaps={data}/>
);

const Split = () => {
	const {state} = exchangeContainer;

	const filteredData = data.filter(x =>
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
