import React from 'react';
import {format as formatDate} from 'date-fns';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange';
import dashboardContainer from 'containers/Dashboard';
import SwapDetails from 'components/SwapDetails';
import Empty from 'components/Empty';
import {formatCurrency} from '../../util';
import {translate} from '../../translate';
import './WalletActivity.scss';

const t = translate('dashboard');

// TODO(sindresorhus): If this view is still similar to the portfolio activity view in the future, we can refactor them into one component with some options. Keeping them separate for now to make it easier to make custom changes.

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
					<div className="type-title">{t('activity.swapTitle')}</div>
					<div className="type-description">
						{t('activity.swapDescription', {
							baseCurrency: swap.baseCurrency,
							quoteCurrency: swap.quoteCurrency,
						})}
					</div>
				</div>
			</td>
			<td className="value">
				<div>
					<div className="value-title">+{swap.broadcast.baseCurrencyAmount} {swap.baseCurrency}</div>
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
					<SwapDetails swap={swap}/>
				</div>
			</td>
		</tr>
	);
};

const ActivityList = ({items}) => {
	if (items.length === 0) {
		return <Empty show text={t('activity.noActivity')}/>;
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
		!swap.isActive &&
		[swap.baseCurrency, swap.quoteCurrency].includes(activeCurrency.symbol)
	);

	return (
		<div className="Wallet--Activity">
			<ActivityList items={swaps}/>
		</div>
	);
};

export default Activity;
