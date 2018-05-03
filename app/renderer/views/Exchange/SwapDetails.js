import title from 'title';
import React from 'react';
import formatDate from 'date-fns/format';
import Modal from 'components/Modal';
import CurrencyIcon from 'components/CurrencyIcon';
import swapTransactions from './../../swap-transactions';
import './SwapDetails.scss';

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
				<React.Fragment key={stage}>
					<code style={{fontSize: '12px'}}>{stage}</code>
					{tx ? (
						<React.Fragment>
							<p>
								{tx.amount} {tx.coin}
								<br/>
								{tx.txid}
							</p>
						</React.Fragment>
					) : (
						<p>Incomplete</p>
					)}
				</React.Fragment>
			);
		});

		const prices = ['requested', 'broadcast', 'executed'].map(value => (
			<React.Fragment key={value}>
				<h5>{title(value)}</h5>
				<p>
					Buy {swap[value].baseCurrencyAmount} {baseCurrency} for {swap[value].quoteCurrencyAmount} {quoteCurrency}
					<br/>
					Price in {quoteCurrency}: {swap[value].price}
				</p>
			</React.Fragment>
		));

		return (
			<div className="modal-wrapper">
				<Modal
					className="SwapDetails"
					title={`${baseCurrency}/${quoteCurrency} Swap - ${title(swap.statusFormatted)}`}
					icon="/assets/swap-icon.svg"
					open={this.state.isOpen}
					onClose={this.close}
					width="560px"
				>
					<React.Fragment>
						<div className="section overview">
							<div className="quote">
								<CurrencyIcon symbol={quoteCurrency}/>
								<p>You exchanged:</p>
								<p className="amount">{swap.broadcast.quoteCurrencyAmount} {quoteCurrency}</p>
							</div>
							<div className="arrow">→</div>
							<div className="base">
								<CurrencyIcon symbol={baseCurrency}/>
								<p>You received:</p>
								<p className="amount">{swap.broadcast.baseCurrencyAmount} {baseCurrency}</p>
							</div>
						</div>
						<div className="section details">
							<h4>ID:</h4>
							<p>{swap.uuid}</p>

							<h4>Date:</h4>
							<p>{formatDate(swap.timeStarted, 'HH:mm DD.MM.YY')}</p>

							<h4>Your offer:</h4>
							{prices}

							<h4>Transactions:</h4>
							{transactions}
						</div>
					</React.Fragment>
				</Modal>
				<button type="button" className="view__button" onClick={this.open}>View</button>
			</div>
		);
	}
}

export default SwapDetails;
