import React from 'react';
import roundTo from 'round-to';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import {formatCurrency} from '../../util';
import {getCurrency} from '../../../marketmaker/supported-currencies';
import {translate} from '../../translate';
import './WithdrawModal.scss';

const t = translate('dashboard');

const getInitialState = () => ({
	isOpen: false,
	recipientAddress: '',
	amount: '',
	amountInUsd: '',
	isWithdrawing: false,
	isBroadcasting: false,
	symbol: '',
	address: '',
	txFeeCurrencySymbol: '',
	txFee: 0,
	txFeeUsd: 0,
	txHex: '',
});

class WithdrawModal extends React.Component {
	state = getInitialState();

	constructor(props) {
		super(props);
		this.initialState = this.state;
	}

	open = () => {
		this.resetState();
		this.setState({isOpen: true});
	};

	close = () => {
		this.resetState();
	};

	resetState = () => {
		this.setState(getInitialState());
	};

	withdrawButtonHandler = async () => {

		this.setState({isWithdrawing: true});

		const {symbol} = dashboardContainer.activeCurrency;
		const {balance} = appContainer.getCurrency(symbol);
		const {recipientAddress: address, amount} = this.state;
		const max = Number(amount) === Number(balance) ? true : false;

		const {
			fee_details: feeDetails,
			tx_hex: txHex,
		} = await appContainer.api.withdraw({
			symbol,
			address,
			amount: Number(amount),
			max,
		});

		const txFee = 'amount' in feeDetails ? parseFloat(feeDetails.amount) : parseFloat(feeDetails.total_fee);

		const currency = getCurrency(symbol);
		const txFeeCurrencySymbol = currency.contractAddress ? 'ETH' : symbol;
		const {cmcPriceUsd} = appContainer.getCurrencyPrice(txFeeCurrencySymbol);
		const txFeeUsd = formatCurrency(txFee * cmcPriceUsd);

		// TODO: For ETH-based currencies, show the gas amount and gas price.

		this.setState({symbol, address, txFeeCurrencySymbol, txFee, txFeeUsd, txHex});
	};

	confirmButtonHandler = async () => {
		this.setState({isBroadcasting: true});
		const {symbol, address, amount, txFee, txFeeUsd, txHex} = this.state;
		console.log('Raw transaction details', {symbol, address, amount, txFee, txFeeUsd, txHex});

		const broadcastTxHash = await appContainer.api.sendRawTransaction({symbol, txHex});

		// TODO: Show the user the broadcast tx hash
		console.log('Broadcast TX hash', broadcastTxHash);

		// TODO: The notification should be clickable and open a block explorer for the currency.
		// We'll need to have a list of block explorers for each currency.
		// eslint-disable-next-line no-new
		new Notification(t('withdraw.successTitle'), {
			body: t('withdraw.successDescription', {address, amount, symbol}),
		});

		this.close();
	};

	render() {
		const currencyInfo = dashboardContainer.activeCurrency;
		const maxAmount = currencyInfo.balance;
		const remainingBalance = roundTo(maxAmount - (Number(this.state.amount) + this.state.txFee), 8);

		const setAmount = value => {
			this.setState({
				amount: String(value),
				amountInUsd: String(Number.parseFloat(value || '0') * currencyInfo.cmcPriceUsd),
			});
		};

		return (
			<div className="modal-wrapper">
				<Modal
					className="WithdrawModal"
					title={t('withdraw.title', {name: currencyInfo.name, symbol: currencyInfo.symbol})}
					open={this.state.isOpen}
					onClose={this.close}
				>
					<>
						<div className="section">
							<label>{t('withdraw.recipientLabel')}:</label>
							<Input
								required
								value={this.state.recipientAddress}
								placeholder={t('withdraw.recipientPlaceholder', {symbol: currencyInfo.symbol})}
								disabled={this.state.isWithdrawing}
								onChange={value => {
									this.setState({recipientAddress: value});
								}}
							/>
						</div>
						<div className="section">
							<label>{t('withdraw.amountLabel')}:</label>
							<div className="amount-inputs">
								<Input
									required
									onlyNumeric
									value={this.state.amount}
									fractionalDigits={8}
									disabled={this.state.isWithdrawing}
									view={() => (
										<span
											className={currencyInfo.symbol.length > 3 ? 'long-symbol' : ''}
										>
											{currencyInfo.symbol}
										</span>
									)}
									onChange={value => {
										setAmount(value);
									}}
								/>
								<span className="separator">≈</span>
								<Input
									required
									onlyNumeric
									value={this.state.amountInUsd}
									fractionalDigits={4}
									disabled={this.state.isWithdrawing}
									view={() => (
										<span>USD</span>
									)}
									onChange={value => {
										this.setState({
											amountInUsd: value,
											amount: String(Number.parseFloat(value || '0') * currencyInfo.cmcPriceUsd),
										});
									}}
								/>
								{/* Hidden because of #302
								<Link
									onClick={() => {
										setAmount(maxAmount);
									}}
								>
									({t('withdraw.maxAmount')})
								</Link>
								*/}
							</div>
						</div>
						<div className="section">
							<div className="info">
								<span>{t('withdraw.remainingBalance')}:</span>
								<span className={remainingBalance < 0 ? 'negative-balance' : ''}>{remainingBalance} {currencyInfo.symbol}</span>
							</div>
							<div className={`info ${this.state.txHex || 'hidden'}`}>
								<span>{t('withdraw.networkFee')}:</span>
								<span>{this.state.txFee} {this.state.txFeeCurrencySymbol} ({this.state.txFeeUsd})</span>
							</div>
						</div>
						{this.state.txHex ? (
							<Button
								primary
								className="confirm-button"
								value={t('withdraw.confirmNetworkFee')}
								disabled={this.state.isBroadcasting}
								onClick={this.confirmButtonHandler}
							/>
						) : (
							<Button
								primary
								className="withdraw-button"
								value={t('withdraw.label')}
								disabled={
									!this.state.recipientAddress ||
									!this.state.amount ||
									remainingBalance < 0 ||
									this.state.isWithdrawing
								}
								onClick={this.withdrawButtonHandler}
							/>
						)}
					</>
				</Modal>
				<Button
					className="OpenModalButton"
					value={t('withdraw.label')}
					disabled={!currencyInfo.balance}
					onClick={this.open}
				/>
			</div>
		);
	}
}

export default WithdrawModal;
