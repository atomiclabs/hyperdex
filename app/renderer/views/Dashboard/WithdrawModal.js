import React from 'react';
import roundTo from 'round-to';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import Link from 'components/Link';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import './WithdrawModal.scss';

const getInitialProps = () => ({
	isOpen: false,
	recipientAddress: '',
	amount: 0,
	isWithdrawing: false,
});

class WithdrawModal extends React.Component {
	state = getInitialProps();

	constructor(props) {
		super(props);
		this.initialState = this.state;
	}

	open = () => {
		this.setState({isOpen: true});
	};

	close = () => {
		this.setState(getInitialProps());
	};

	withdrawButtonHandler = async () => {
		this.setState({isWithdrawing: true});

		const currency = dashboardContainer.activeCurrency.symbol;
		const {recipientAddress: address, amount} = this.state;

		await appContainer.api.withdraw({
			currency,
			address,
			amount,
		});

		// TODO: The notification should be clickable and open a block explorer for the currency.
		// We'll need to have a list of block explorers for each currency.
		// eslint-disable-next-line no-new
		new Notification('Successful withdrawal!', {
			body: `${amount} ${currency} sent to ${address}`,
		});

		this.close();
	};

	render() {
		const currencyInfo = dashboardContainer.activeCurrency;
		const networkFee = 0; // TODO: Implement getting the network fees
		const maxAmount = currencyInfo.balance - networkFee;
		const remainingBalance = roundTo(maxAmount - this.state.amount, 8);
		const setAmount = amount => {
			/// this.setState({amount});
			// Workaround for:
			// https://github.com/facebook/react/issues/9402
			// We force React to update
			this.setState({amount: 0}, () => {
				this.setState({amount});
			});
		};

		return (
			<div className="modal-wrapper">
				<Modal
					className="WithdrawModal"
					title={`Withdraw ${currencyInfo.name} (${currencyInfo.symbol})`}
					open={this.state.isOpen}
					onClose={this.close}
				>
					<React.Fragment>
						<div className="section">
							<label>Recipient:</label>
							<Input
								required
								value={this.state.recipientAddress}
								placeholder={`Enter ${currencyInfo.symbol} Address`}
								disabled={this.state.isWithdrawing}
								onChange={value => {
									this.setState({recipientAddress: value});
								}}
							/>
						</div>
						<div className="section">
							<label>Amount:</label>
							<div className="amount-inputs">
								<Input
									value={roundTo(this.state.amount, 8)}
									type="number"
									min={0}
									step="any"
									required
									disabled={this.state.isWithdrawing}
									onChange={value => {
										const amount = Number.parseFloat(value || 0);
										setAmount(amount);
									}}
									view={() => (
										<span>{currencyInfo.symbol}</span>
									)}
								/>
								<span className="separator">≈</span>
								<Input
									value={roundTo(this.state.amount * currencyInfo.cmcPriceUsd, 8)}
									type="number"
									min={0}
									step="any"
									required
									disabled={this.state.isWithdrawing}
									onChange={value => {
										const amount = Number.parseFloat(value || 0) / currencyInfo.cmcPriceUsd;
										setAmount(amount);
									}}
									view={() => (
										<span>USD</span>
									)}
								/>
								<Link
									onClick={() => {
										setAmount(maxAmount);
									}}
								>
									(Max)
								</Link>
							</div>
						</div>
						<div className="section">
							<div className="info">
								<span>Network fee:</span>
								<span>{networkFee} (TODO!)</span>
							</div>
							<div className="info">
								<span>Remaining balance:</span>
								<span className={remainingBalance < 0 ? 'negative-balance' : ''}>{remainingBalance}</span>
							</div>
						</div>
						<Button
							className="withdraw-button"
							primary
							value="Withdraw"
							disabled={
								!this.state.recipientAddress ||
								!this.state.amount ||
								remainingBalance < 0 ||
								this.state.isWithdrawing
							}
							onClick={this.withdrawButtonHandler}
						/>
					</React.Fragment>
				</Modal>
				<Button
					className="OpenModalButton"
					value="Withdraw"
					disabled={!currencyInfo.balance}
					onClick={this.open}
				/>
			</div>
		);
	}
}

export default WithdrawModal;
