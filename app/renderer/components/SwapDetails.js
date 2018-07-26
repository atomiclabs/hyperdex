import {clipboard} from 'electron';
import title from 'title';
import React from 'react';
import formatDate from 'date-fns/format';
import Modal from 'components/Modal';
import Progress from 'components/Progress';
import CurrencyIcon from 'components/CurrencyIcon';
import Button from 'components/Button';
import ExternalLink from 'components/ExternalLink';
import {isDevelopment} from '../../util-common';
import swapTransactions from '../swap-transactions';
import blockExplorer from '../block-explorer';
import {zeroPadFraction} from '../util';
import {translate} from '../translate';
import './SwapDetails.scss';

const t = translate('swap');

const getOverview = swap => {
	const isBuyOrder = swap.orderType === 'buy';
	const overview = {
		fromTitle: `${t('details.exchanging')}:`,
		forTitle: `${t('details.for')}:`,
		fromCurrency: isBuyOrder ? swap.quoteCurrency : swap.baseCurrency,
		forCurrency: isBuyOrder ? swap.baseCurrency : swap.quoteCurrency,
		fromAmount: isBuyOrder ? swap.broadcast.quoteCurrencyAmount : swap.broadcast.baseCurrencyAmount,
		forAmount: isBuyOrder ? swap.broadcast.baseCurrencyAmount : swap.broadcast.quoteCurrencyAmount,
	};

	if (swap.executed.quoteCurrencyAmount) {
		overview.fromTitle = `${t('details.youExchanged')}:`;
		overview.forTitle = `${t('details.youReceived')}:`;
		overview.fromAmount = isBuyOrder ? swap.executed.quoteCurrencyAmount : swap.executed.baseCurrencyAmount;
		overview.forAmount = isBuyOrder ? swap.executed.baseCurrencyAmount : swap.executed.quoteCurrencyAmount;
	}

	return overview;
};

class SwapDetails extends React.Component {
	state = {
		isOpen: false,
	};

	open = () => {
		this.setState({isOpen: true});
	};

	close = () => {
		this.setState({isOpen: false});
	};

	render() {
		const {swap} = this.props;
		const {baseCurrency, quoteCurrency} = swap;

		const transactions = swap.transactions.map(tx => (
			<React.Fragment key={tx.stage}>
				<div className="arrow completed">→</div>
				<ExternalLink url={blockExplorer.tx(tx.coin, tx.txid)}>
					<div className="item completed" title={tx.txid}>
						<h6>{t(`details.${tx.stage}`)}</h6>
						<p>{tx.amount}<br/>{tx.coin}</p>
					</div>
				</ExternalLink>
			</React.Fragment>
		));

		if (swap.status === 'swapping') {
			swapTransactions.forEach(stage => {
				const tx = swap.transactions.find(tx => tx.stage === stage);

				if (!tx) {
					transactions.push(
						<React.Fragment key={stage}>
							<div className="arrow">→</div>
							<div className="item">
								<h6>{t(`details.${stage}`)}</h6>
							</div>
						</React.Fragment>
					);
				}
			});
		}

		const prices = ['requested', 'broadcast', 'executed'].map(value => {
			if (!swap[value].price) {
				return null;
			}

			return (
				<div key={value}>
					<h6>{t(`details.${value}`)}</h6>
					<p>
						<span className="label">{t(`details.${swap.orderType}`)}:</span> {zeroPadFraction(swap[value].baseCurrencyAmount)} {baseCurrency}
						<br/>
						<span className="label">{t('details.for')}:</span> {zeroPadFraction(swap[value].quoteCurrencyAmount)} {quoteCurrency}
						<br/>
						<span className="label">{t('details.price')}:</span> {zeroPadFraction(swap[value].price)} {quoteCurrency}
					</p>
				</div>
			);
		});

		const overview = getOverview(swap);

		return (
			<div className="modal-wrapper">
				<Modal
					className="SwapDetails"
					title={`${baseCurrency}/${quoteCurrency} ${t(`details.${swap.orderType}`)} ${t('details.order')} \u{00A0}• \u{00A0}${formatDate(swap.timeStarted, 'HH:mm DD/MM/YY')}`}
					icon="/assets/swap-icon.svg"
					open={this.state.isOpen}
					onClose={this.close}
					width="660px"
				>
					<React.Fragment>
						<div className="section overview">
							<div className="from">
								<CurrencyIcon symbol={overview.fromCurrency}/>
								<p>{overview.fromTitle}</p>
								<p className="amount">{overview.fromAmount} {overview.fromCurrency}</p>
							</div>
							<div className="arrow">→</div>
							<div className="for">
								<CurrencyIcon symbol={overview.forCurrency}/>
								<p>{overview.forTitle}</p>
								<p className="amount">{overview.forAmount} {overview.forCurrency}</p>
							</div>
						</div>
						<div className="section progress">
							<Progress
								value={swap.progress}
								color={
									(swap.status === 'completed' && 'var(--success-color)') ||
									(swap.status === 'failed' && 'var(--error-color)')
								}
							/>
							<p>
								{title(swap.statusFormatted)}
								{(swap.status === 'failed' && swap.error) && (
									<React.Fragment>
										<br/>
										{swap.error.message}
									</React.Fragment>
								)}
							</p>
							{swap.statusInformation && (
								<p>{swap.statusInformation}</p>
							)}
						</div>
						<div className="section details">
							<div className="offer-wrapper">
								<h4>{t('details.yourOffer')}</h4>
								<div className="offer">
									{prices}
								</div>
								{swap.executed.percentCheaperThanRequested > 0 && (
									<p>
										{t('details.stats', {
											percentCheaperThanRequested: swap.executed.percentCheaperThanRequested,
										})}
									</p>
								)}
							</div>
							{(transactions.length > 0) && (
								<React.Fragment>
									<h4>{t('details.transactions')}</h4>
									<div className="transactions">
										{transactions}
									</div>
								</React.Fragment>
							)}
							<p>ID: {swap.uuid}</p>
							{isDevelopment &&
								<Button
									value={t('details.copyDebugData')}
									onClick={() => {
										clipboard.writeText(JSON.stringify(swap, null, '\t'));
									}}
								/>
							}
						</div>
					</React.Fragment>
				</Modal>
				<button type="button" className="view__button" onClick={this.open}>{t('details.view')}</button>
			</div>
		);
	}
}

export default SwapDetails;
