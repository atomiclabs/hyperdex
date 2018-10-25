import React from 'react';
import dashboardContainer from 'containers/Dashboard';
import {translate} from '../../translate';
import WithdrawModal from './WithdrawModal';
import DepositModal from './DepositModal';
import './WalletInfo.scss';

const t = translate('dashboard');

const WalletInfo = () => {
	const {activeCurrency} = dashboardContainer;
	const priceChangeClass = activeCurrency.cmcPercentChange24h >= 0 ? 'is-positive' : '';

	return (
		<div className="Wallet--Info">
			<div className="currency-info">
				<div className="item">
					<h6>{t('info.holdings', {symbol: activeCurrency.symbol})}</h6>
					<span>{activeCurrency.balanceFormatted}</span>
				</div>
				<div className="item">
					<h6>{t('info.price', {symbol: activeCurrency.symbol})}</h6>
					<span>{activeCurrency.cmcPriceUsdFormatted}</span>
					{activeCurrency.cmcPercentChange24h ?
						(
							<div className={`price-change ${priceChangeClass}`}>
								<span className="arrow"/>
								<span className="percentage">{Math.abs(activeCurrency.cmcPercentChange24h)}% (24h)</span>
							</div>
						) :
						null
					}
				</div>
				<div className="item">
					<h6>{t('info.value', {symbol: activeCurrency.symbol})}</h6>
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

export default WalletInfo;
