import {remote, clipboard} from 'electron';
import title from 'title';
import React from 'react';
import PropTypes from 'prop-types';
import formatDate from 'date-fns/format';
import appContainer from 'containers/App';
import Modal from 'components/Modal';
import Progress from 'components/Progress';
import CurrencyIcon from 'components/CurrencyIcon';
import Button from 'components/Button';
import ExternalLink from 'components/ExternalLink';
import Link from 'components/Link';
import RightArrowIcon from 'icons/RightArrow';
import {isDevelopment} from '../../util-common';
import blockExplorer from '../block-explorer';
import {zeroPadFraction} from '../util';
import {translate} from '../translate';
import './SwapDetails.scss';

const config = remote.require('./config');
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
	static propTypes = {
		swapId: PropTypes.string,
		open: PropTypes.bool,
		didClose: PropTypes.func,
	}

	static defaultProps = {
		swapId: undefined,
		open: false,
		didClose: undefined,
	};

	state = {
		showAdvanced: config.get('swapModalShowAdvanced'),
	};

	setShowAdvanced = showAdvanced => {
		this.setState({showAdvanced});
		config.set('swapModalShowAdvanced', showAdvanced);
	};

	showTransaction = swap => {
		if(!swap) return null;

		const transactions = swap.stages.map(stage => (
			<React.Fragment key={`${swap.uuid}-${stage.event.type}`}>
				<div className="arrow completed">→</div>
				{stage.event.data && stage.event.data.tx_hash ? (
					<ExternalLink url={stage.event.data.tx_hash ? blockExplorer.tx(stage.event.data.coin, stage.event.data.tx_hash) : null}>
						<div className="item completed">
							<h6>{t(`swapStages.${stage.event.type}`)}</h6>
							{/* <p>{stage.event.data.total_amount}<br/>{stage.event.data.coin}</p> */}
							{parseFloat(stage.event.data.my_balance_change) !== 0 && (<p>{stage.event.data.my_balance_change}<br/>{stage.event.data.coin}</p>)}
						</div>
					</ExternalLink>
				) : (
					<div className="item completed">
						<h6>{t(`swapStages.${stage.event.type}`)}</h6>
					</div>
				)}
			</React.Fragment>
		));
		if (swap.totalStages) {
			for (const stageType of swap.totalStages) {
				const isStageFinished = swap.stages.some(x => x.event.type === stageType);

				if (!isStageFinished) {
					transactions.push(
						<React.Fragment key={`${swap.uuid}-${stageType}`}>
							<div className="arrow">→</div>
							<div className="item">
								<h6>{t(`swapStages.${stageType}`)}</h6>
							</div>
						</React.Fragment>
					);
				}
			}
		}

		return (
			<div className="transactions" key={swap.uuid}>
				{transactions}
			</div>
		);
	}

	render() {
		const {
			swapId,
			open,
			didClose,
		} = this.props;

		if (!swapId) {
			return null;
		}

		// const swap = appContainer.state.swapHistory.find(swap => swap.uuid === swapId);
		const order = appContainer.state.ordersHistory.find(order => order.uuid === swapId);
		// get last swap
		let swap = null;
		if(order.swaps.length > 0)
			swap = order.swaps[order.swaps.length - 1];

		const {baseCurrency, quoteCurrency} = order;

		const prices = ['requested', 'broadcast', 'executed'].map(value => {
			if (!order[value].price) {
				return null;
			}

			return (
				<div key={value}>
					<h6>{t(`details.${value}`)}</h6>
					<p>
						<span className="label">{t(`details.${order.action}`)}:</span> {zeroPadFraction(order[value].baseCurrencyAmount)} {baseCurrency}
						<br/>
						<span className="label">{t('details.for')}:</span> {zeroPadFraction(order[value].quoteCurrencyAmount)} {quoteCurrency}
						<br/>
						<span className="label">{t('details.price')}:</span> {zeroPadFraction(order[value].price)} {quoteCurrency}
					</p>
				</div>
			);
		});

		const overview = getOverview(order);

		const titleComponent = (
			<div className="title">
				<div>{title(order.statusFormatted)}</div>
				<div className="title__main">{baseCurrency}/{quoteCurrency} {t(`details.${order.orderType}`)} {t('details.order')}</div>
				<div>{formatDate(order.timeStarted, 'HH:mm DD/MM/YY')}</div>
			</div>
		);

		return (
			<div className="modal-wrapper">
				<Modal
					className="SwapDetails"
					title={titleComponent}
					icon="/assets/swap-icon.svg"
					open={open}
					didClose={didClose}
					width="800px"
				>
					<>
						<Progress
							value={swap ? swap.progress : 0}
							color={
								(swap && swap.status === 'completed' && 'var(--success-color)') ||
								(swap && swap.status === 'failed' && 'var(--error-color)') ||
							null
							}
						/>
						<div className="section overview">
							<div className="from">
								{order.isOpen && (
									<div className="currency-animation">
										<div className="scale-wrapper">
											<CurrencyIcon className="to" symbol={overview.forCurrency}/>
											<CurrencyIcon className="from" symbol={overview.fromCurrency}/>
										</div>
									</div>
								)}
								<CurrencyIcon symbol={overview.fromCurrency}/>
								<p>{overview.fromTitle}</p>
								<p className="amount">{overview.fromAmount} {overview.fromCurrency}</p>
							</div>
							{!order.isOpen && (
								<RightArrowIcon className="RightArrow" size="20px"/>
							)}
							<div className="to">
								<CurrencyIcon symbol={overview.forCurrency}/>
								<p>{overview.forTitle}</p>
								<p className="amount">{overview.forAmount} {overview.forCurrency}</p>
							</div>
						</div>
						<Link
							className={`toggle-advanced ${this.state.showAdvanced && 'is-shown'}`}
							onClick={() => {
								this.setShowAdvanced(!this.state.showAdvanced);
							}}
						>
							<RightArrowIcon className="toggle-advanced__arrow" size="8px"/>
							{this.state.showAdvanced ? t('toggleAdvancedButton.less') : t('toggleAdvancedButton.more')}
						</Link>
						{this.state.showAdvanced && (
							<div className="details">
								<div className="section progress">
									<p>
										{swap && (swap.status === 'failed' && swap.error) && (
											swap.error.message
										)}
									</p>
									{swap && swap.statusInformation && (
										<p>{swap.statusInformation}</p>
									)}
								</div>
								<div className="section details">
									<div className="offer-wrapper">
										<h4>{t('details.yourOffer')}</h4>
										<div className="offer">
											{prices}
										</div>
										{/* {swap && swap.executed && swap.executed.percentCheaperThanRequested > 0 && (
											<p>
												{t('details.stats', {
													percentCheaperThanRequested: swap && swap.executed.percentCheaperThanRequested,
												})}
											</p>
										)} */}
									</div>
									{(order.swaps.length > 0) && (
										<>
											<h4>{t('details.transactions')}</h4>
											{order.swaps.map(this.showTransaction)}
										</>
									)}
									<p>
										ID: {order.uuid}
										<br />
										Type: {t(`details.${order.orderType}`)}
									</p>
									{isDevelopment &&
										<Button
											value={t('details.copyDebugData')}
											onClick={() => {
												clipboard.writeText(JSON.stringify(swap, null, '\t'));
											}}
										/>
									}
								</div>
							</div>
						)}
					</>
				</Modal>
			</div>
		);
	}
}

export default SwapDetails;
