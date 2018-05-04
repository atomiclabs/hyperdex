import title from 'title';
import React from 'react';
import formatDate from 'date-fns/format';
import Modal from 'components/Modal';
import Progress from 'components/Progress';
import CurrencyIcon from 'components/CurrencyIcon';
import swapTransactions from './../../swap-transactions';
import './SwapDetails.scss';

const stageToTitle = new Map([
	['myfee', 'My Fee'],
	['bobdeposit', 'Bob Deposit'],
	['alicepayment', 'Alice Payment'],
	['bobpayment', 'Bob Payment'],
	['alicespend', 'Alice Spend'],
]);

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

		const transactions = swapTransactions.map(stage => {
			const tx = swap.transactions.find(tx => tx.stage === stage);

			return (
				<div key={stage}>
					<h6 title={tx && tx.txid}>{stageToTitle.get(stage)}</h6>
					{tx ? (
						<p>{tx.amount} {tx.coin}</p>
					) : (
						<p>Incomplete</p>
					)}
				</div>
			);
		});

		const prices = ['requested', 'broadcast', 'executed'].map(value => (
			<div key={value}>
				<h6>{title(value)}</h6>
				<p>
					Buy: {swap[value].baseCurrencyAmount} {baseCurrency}
					<br/>
					For: {swap[value].quoteCurrencyAmount} {quoteCurrency}
					<br/>
					Price: {swap[value].price} {quoteCurrency}
				</p>
			</div>
		));

		const overviewData = (() => {
			let overview = {
				quoteTitle: 'Requesting:',
				baseTitle: 'For:',
				quoteAmount: swap.requested.quoteCurrencyAmount,
				baseAmount: swap.requested.baseCurrencyAmount,
			};

			if (swap.broadcast.quoteCurrencyAmount) {
				overview = {
					quoteTitle: 'Exchanging:',
					baseTitle: 'For:',
					quoteAmount: swap.broadcast.quoteCurrencyAmount,
					baseAmount: swap.broadcast.baseCurrencyAmount,
				};
			}

			if (swap.executed.quoteCurrencyAmount) {
				overview = {
					quoteTitle: 'You exchanged:',
					baseTitle: 'You received:',
					quoteAmount: swap.executed.quoteCurrencyAmount,
					baseAmount: swap.executed.baseCurrencyAmount,
				};
			}

			return overview;
		})();

		return (
			<div className="modal-wrapper">
				<Modal
					className="SwapDetails"
					title={`${baseCurrency}/${quoteCurrency} Swap - ${formatDate(swap.timeStarted, 'HH:mm DD.MM.YY')}`}
					icon="/assets/swap-icon.svg"
					open={this.state.isOpen}
					onClose={this.close}
					width="640px"
				>
					<React.Fragment>
						<div className="section overview">
							<div className="quote">
								<CurrencyIcon symbol={quoteCurrency}/>
								<p>{overviewData.quoteTitle}</p>
								<p className="amount">{overviewData.quoteAmount} {quoteCurrency}</p>
							</div>
							<div className="arrow">→</div>
							<div className="base">
								<CurrencyIcon symbol={baseCurrency}/>
								<p>{overviewData.baseTitle}</p>
								<p className="amount">{overviewData.baseAmount} {baseCurrency}</p>
							</div>
						</div>
						<div className="section progress">
							<Progress value={0.8}/>
							<p>{title(swap.statusFormatted)}</p>
						</div>
						<div className="section details">
							<h4>Your offer</h4>
							<div className="offer">
								{prices}
							</div>

							<h4>Transactions</h4>
							<div className="transactions">
								{transactions}
								<div>
									<h6>Alice Spend</h6>
									<p>0.00001247 KMD</p>
								</div>
							</div>

							<p>ID: {swap.uuid}</p>
						</div>
					</React.Fragment>
				</Modal>
				<button type="button" className="view__button" onClick={this.open}>View</button>
			</div>
		);
	}
}

export default SwapDetails;
