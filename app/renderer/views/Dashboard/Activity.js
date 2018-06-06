import React from 'react';
import {format as formatDate} from 'date-fns';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange';
import Empty from 'components/Empty';
import {formatCurrency} from '../../util';
import './Activity.scss';

const ActivityItem = ({swap}) => {
	const {cmcPriceUsd} = appContainer.getCurrencyPrice(swap.baseCurrency);
	const totalUsd = swap.broadcast.baseCurrencyAmount * cmcPriceUsd;

	return (
		<tr>
			<td className="timestamp">
				<div>
					<div>{formatDate(swap.timeStarted, 'HH:mm')}</div>
					<div>{formatDate(swap.timeStarted, 'DD/MM/YY')}</div>
				</div>
			</td>
			<td className="type">
				<div>
					<div className="type-title">Swapped</div>
					<div className="type-description">{swap.quoteCurrency} for {swap.baseCurrency}</div>
				</div>
			</td>
			<td className="value">
				<div className="value-title">+{swap.broadcast.baseCurrencyAmount} {swap.baseCurrency}</div>
				<div className="value-description">≈ {formatCurrency(totalUsd)}</div>
			</td>
		</tr>
	);
};

const ActivityList = ({items}) => {
	if (items.length === 0) {
		return <Empty show text="No activity yet"/>;
	}

	// TODO: Only swaps for now, so this code assume swaps

	return (
		<div className="ActivityList">
			<table>
				<tbody>
					{
						items.map(swap => (
							<ActivityItem key={swap.uuid} swap={swap}/>
						))
					}
				</tbody>
			</table>
		</div>
	);
};

const Activity = () => {
	const successfulSwaps = exchangeContainer.state.swapHistory.filter(x => x.status === 'completed');

	return (
		<div className="Dashboard--Activity">
			<header>
				<h3>Recent Activity</h3>
			</header>
			<main>
				<ActivityList items={successfulSwaps}/>
			</main>
		</div>
	);
};

export default Activity;
