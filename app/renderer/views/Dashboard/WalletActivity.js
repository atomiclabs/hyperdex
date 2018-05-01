import React from 'react';
import {format as formatDate} from 'date-fns';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange';
import dashboardContainer from 'containers/Dashboard';
import {formatCurrency} from '../../util';
import SwapDetails from '../Exchange/SwapDetails';
import './WalletActivity.scss';

// TODO(sindresorhus): If this view is still similar to the portfolio activity view in the future, we can refactor them into one component with some options. Keeping them separate for now to make it easier to make custom changes.

const Empty = () => (
	<div className="Empty">
		<p>No activity yet</p>
	</div>
);

const ActivityItem = ({swap}) => {
	const {cmcPriceUsd} = appContainer.getCurrency(swap.baseCurrency);
	const totalUsd = swap.baseCurrencyAmount * cmcPriceUsd;

	return (
		<tr>
			<td className="timestamp">
				<div>
					<div>{formatDate(swap.timeStarted, 'HH:mm')}</div>
					<div>{formatDate(swap.timeStarted, 'DD.MM.YY')}</div>
				</div>
			</td>
			<td className="type">
				<div>
					<div className="type-title">{swap.status === 'failed' ? 'Did Not Swap' : 'Swapped'}</div>
					<div className="type-description">{swap.quoteCurrency} for {swap.baseCurrency}</div>
				</div>
			</td>
			<td className="value">
				<div>
					<div className="value-title">+{swap.baseCurrencyAmount} {swap.baseCurrency}</div>
					<div className="value-description">≈ {formatCurrency(totalUsd)}</div>
				</div>
			</td>
			<td className="status">
				<div>
					<div className="status__icon" data-status={swap.status}>{swap.statusFormatted}</div>
				</div>
			</td>
			<td className="view">
				<div>
					<SwapDetails/>
				</div>
			</td>
		</tr>
	);
};

const ActivityList = ({items}) => {
	if (items.length === 0) {
		return <Empty/>;
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
	const {activeCurrency} = dashboardContainer;

	const swaps = exchangeContainer.state.swapHistory.filter(swap =>
		['completed', 'failed'].includes(swap.status) &&
		[swap.baseCurrency, swap.quoteCurrency].includes(activeCurrency.symbol)
	);

	return (
		<div className="Wallet--Activity">
			<ActivityList items={swaps}/>
		</div>
	);
};

export default Activity;
