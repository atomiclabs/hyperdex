import React from 'react';
import roundTo from 'round-to';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import Link from 'components/Link';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import {formatCurrency} from '../../util';
import {getCurrency} from '../../../marketmaker/supported-currencies';
import {translate} from '../../translate';
import './WithdrawModal.scss';

const t = translate('dashboard');

const getInitialProps = () => ({
	isOpen: false,
	recipientAddress: '',
	amount: '',
	amountInUsd: '',
	isWithdrawing: false,
	isBroadcasting: false,
	txFeeCurrencySymbol: '',
	txFee: 0,
	txFeeUsd: 0,
	broadcast: false,
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

		const {symbol} = dashboardContainer.activeCurrency;
		const {recipientAddress: address, amount} = this.state;

		const {txFee, broadcast} = await appContainer.api.withdraw({
			symbol,
			address,
			amount: Number(amount),
		});

		const currency = getCurrency(symbol);
		const txFeeCurrencySymbol = currency.etomic ? 'ETH' : symbol;
		const {cmcPriceUsd} = appContainer.getCurrencyPrice(txFeeCurrencySymbol);
		const txFeeUsd = formatCurrency(txFee * cmcPriceUsd);

		this.setState({txFeeCurrencySymbol, txFee, txFeeUsd, broadcast});
	};

	confirmButtonHandler = async () => {
		this.setState({isBroadcasting: true});
		const {txid, amount, symbol, address} = await this.state.broadcast();
		console.log({txid, amount, symbol, address});

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
								value={this.state.recipientAddress}
								required
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
									value={this.state.amount}
									required
									onlyNumeric
									fractionalDigits={8}
									disabled={this.state.isWithdrawing}
									onChange={value => {
										setAmount(value);
									}}
									view={() => (
										<span
											className={currencyInfo.symbol.length > 3 ? 'long-symbol' : ''}
										>
											{currencyInfo.symbol}
										</span>
									)}
								/>
								<span className="separator">≈</span>
								<Input
									value={this.state.amountInUsd}
									required
									onlyNumeric
									fractionalDigits={4}
									disabled={this.state.isWithdrawing}
									onChange={value => {
										this.setState({
											amountInUsd: value,
											amount: String(Number.parseFloat(value || '0') * currencyInfo.cmcPriceUsd),
										});
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
									({t('withdraw.maxAmount')})
								</Link>
							</div>
						</div>
						<div className="section">
							<div className="info">
								<span>{t('withdraw.remainingBalance')}:</span>
								<span className={remainingBalance < 0 ? 'negative-balance' : ''}>{remainingBalance} {currencyInfo.symbol}</span>
							</div>
							<div className={`info ${this.state.broadcast || 'hidden'}`}>
								<span>{t('withdraw.networkFee')}:</span>
								<span>{this.state.txFee} {this.state.txFeeCurrencySymbol} ({this.state.txFeeUsd})</span>
							</div>
						</div>
						{this.state.broadcast ? (
							<Button
								className="confirm-button"
								primary
								value={t('withdraw.confirmNetworkFee')}
								disabled={this.state.isBroadcasting}
								onClick={this.confirmButtonHandler}
							/>
						) : (
							<Button
								className="withdraw-button"
								primary
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
