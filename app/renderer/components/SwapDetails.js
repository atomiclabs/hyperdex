import {clipboard} from 'electron';
import title from 'title';
import React from 'react';
import formatDate from 'date-fns/format';
import Modal from 'components/Modal';
import Progress from 'components/Progress';
import CurrencyIcon from 'components/CurrencyIcon';
import Button from 'components/Button';
import {isDevelopment} from '../../util-common';
import swapTransactions from '../swap-transactions';
import {zeroPadFraction} from '../util';
import './SwapDetails.scss';

const stageToTitle = new Map([
	['myfee', 'My Fee'],
	['bobdeposit', 'Bob Deposit'],
	['alicepayment', 'Alice Payment'],
	['bobpayment', 'Bob Payment'],
	['alicespend', 'Alice Spend'],
]);

const getOverview = swap => {
	const isBuyOrder = swap.orderType === 'buy';
	const overview = {
		fromTitle: 'Exchanging:',
		forTitle: 'For:',
		fromCurrency: isBuyOrder ? swap.quoteCurrency : swap.baseCurrency,
		forCurrency: isBuyOrder ? swap.baseCurrency : swap.quoteCurrency,
		fromAmount: isBuyOrder ? swap.broadcast.quoteCurrencyAmount : swap.broadcast.baseCurrencyAmount,
		forAmount: isBuyOrder ? swap.broadcast.baseCurrencyAmount : swap.broadcast.quoteCurrencyAmount,
	};

	if (swap.executed.quoteCurrencyAmount) {
		overview.fromTitle = 'You exchanged:';
		overview.forTitle = 'You received:';
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

		let hasTransactions = false;
		const transactions = swapTransactions.map(stage => {
			const tx = swap.transactions.find(tx => tx.stage === stage);

			if (!tx) {
				return (
					<React.Fragment key={stage}>
						<div className="arrow">→</div>
						<div className="item">
							<h6>{stageToTitle.get(stage)}</h6>
						</div>
					</React.Fragment>
				);
			}

			hasTransactions = true;

			return (
				<React.Fragment key={stage}>
					<div className="arrow completed">→</div>
					<div className="item completed" title={tx.txid}>
						<h6>{stageToTitle.get(stage)}</h6>
						<p>{tx.amount}<br/>{tx.coin}</p>
					</div>
				</React.Fragment>
			);
		});

		const prices = ['requested', 'broadcast', 'executed'].map(value => {
			if (!swap[value].price) {
				return null;
			}

			return (
				<div key={value}>
					<h6>{title(value)}</h6>
					<p>
						<span className="label">{title(swap.orderType)}:</span> {zeroPadFraction(swap[value].baseCurrencyAmount)} {baseCurrency}
						<br/>
						<span className="label">For:</span> {zeroPadFraction(swap[value].quoteCurrencyAmount)} {quoteCurrency}
						<br/>
						<span className="label">Price:</span> {zeroPadFraction(swap[value].price)} {quoteCurrency}
					</p>
				</div>
			);
		});

		const overview = getOverview(swap);

		return (
			<div className="modal-wrapper">
				<Modal
					className="SwapDetails"
					title={`${baseCurrency}/${quoteCurrency} ${title(swap.orderType)} Order \u{00A0}• \u{00A0}${formatDate(swap.timeStarted, 'HH:mm DD/MM/YY')}`}
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
							<Progress value={swap.progress}/>
							<p>
								{title(swap.statusFormatted)}
								{(swap.status === 'failed' && swap.error) && (
									<React.Fragment>
										<br/>
										{swap.error.message}
									</React.Fragment>
								)}
							</p>
						</div>
						<div className="section details">
							<div className="offer-wrapper">
								<h4>Your offer</h4>
								<div className="offer">
									{prices}
								</div>
								{swap.executed.percentCheaperThanRequested > 0 && (
									<p>The executed price was {swap.executed.percentCheaperThanRequested}% cheaper than requested!</p>
								)}
							</div>
							{hasTransactions && (
								<React.Fragment>
									<h4>Transactions</h4>
									<div className="transactions">
										{transactions}
									</div>
								</React.Fragment>
							)}
							<p>ID: {swap.uuid}</p>
							{isDevelopment &&
								<Button
									value="Copy Swap Debug Data"
									onClick={() => {
										clipboard.writeText(JSON.stringify(swap, null, '\t'));
									}}
								/>
							}
						</div>
					</React.Fragment>
				</Modal>
				<button type="button" className="view__button" onClick={this.open}>View</button>
			</div>
		);
	}
}

export default SwapDetails;
