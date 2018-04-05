import React from 'react';
import dashboardContainer from 'containers/Dashboard';
import WithdrawModal from './WithdrawModal';
import DepositModal from './DepositModal';
import './Wallet.scss';

const Wallet = () => {
	const {activeCurrency} = dashboardContainer;
	const priceChangeClass = activeCurrency.cmcPercentChange24h >= 0 ? 'is-positive' : '';

	return (
		<div className="Dashboard--Wallet">
			<div className="currency-info">
				<div className="item">
					<h6>{activeCurrency.symbol} Holdings</h6>
					<span>{activeCurrency.balanceFormatted}</span>
				</div>
				<div className="item">
					<h6>{activeCurrency.symbol} Price</h6>
					<span>{activeCurrency.cmcPriceUsdFormatted}</span>
					{activeCurrency.cmcPercentChange24h &&
						<div className={`price-change ${priceChangeClass}`}>
							<span className="arrow"/>
							<span className="percentage">{Math.abs(activeCurrency.cmcPercentChange24h)}% (24h)</span>
						</div>
					}
				</div>
				<div className="item">
					<h6>{activeCurrency.symbol} Holdings Value</h6>
					<span>{activeCurrency.cmcBalanceUsdFormatted}</span>
				</div>
			</div>
			<div className="button-wrapper">
				<WithdrawModal/>
				<DepositModal/>
			</div>
		</div>
	);
};

export default Wallet;
