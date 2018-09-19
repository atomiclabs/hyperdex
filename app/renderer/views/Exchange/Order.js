import React from 'react';
import roundTo from 'round-to';
import _ from 'lodash';
import SuperComponent from 'components/SuperComponent';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import CurrencySelectOption from 'components/CurrencySelectOption';
import exchangeContainer from 'containers/Exchange';
import appContainer from 'containers/App';
import CrosshairIcon from 'icons/Crosshair';
import {formatCurrency} from '../../util';
import {translate} from '../../translate';
import './Order.scss';

const t = translate('exchange');

class Top extends React.Component {
	handleSelectChange = selectedOption => {
		if (this.props.type === 'buy') {
			exchangeContainer.setBaseCurrency(selectedOption.value);
		} else {
			exchangeContainer.setQuoteCurrency(selectedOption.value);
		}
	};

	render() {
		const {currencies} = appContainer.state;
		const selectedCurrency = this.props.getSelectedCurrency();

		const selectData = currencies.map(currency => ({
			label: `${currency.name} (${currency.symbol})`,
			value: currency.symbol,
		}));

		return (
			<div className="top">
				<Select
					className="currency-selector"
					value={selectedCurrency.symbol}
					options={selectData}
					onChange={this.handleSelectChange}
					valueRenderer={CurrencySelectOption}
					optionRenderer={CurrencySelectOption}
				/>
				<h3 className="balance">
					{t('order.symbolBalance')}: <span>{roundTo(selectedCurrency.balance, 8)} {selectedCurrency.symbol}</span>
				</h3>
				<p className="address">{selectedCurrency.address}</p>
			</div>
		);
	}
}

const Center = props => {
	const {state} = exchangeContainer;

	const selectRow = row => {
		let {price} = row;

		// TODO: This should be fixed properly in mm or use more sensible logic here
		// This is just a quick fix to increase match rate
		const percentMoreExpensive = 5 / 100;
		const pricePercentage = price * percentMoreExpensive;
		if (props.type === 'buy') {
			price += pricePercentage;
		} else {
			price -= pricePercentage;
		}

		return props.handlePriceChange(price);
	};

	return (
		<div className="center">
			<h3>{`${state.baseCurrency} ${props.type === 'buy' ? t('order.sellOrders') : t('order.buyOrders')}`}</h3>
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>{t('order.price', {symbol: state.quoteCurrency})}</th>
							<th>{t('order.averageVolume')}</th>
							<th>{t('order.maxVolume')}</th>
						</tr>
					</thead>
					<tbody>
						{(() => {
							/* eslint-disable react/no-array-index-key */
							return props.getOrderBook().map((row, i) => (
								<tr key={i} onClick={() => selectRow(row)}>
									<td>{row.price}</td>
									<td>{roundTo(row.averageVolume, 8)}</td>
									<td>{roundTo(row.maxVolume, 8)}</td>
								</tr>
							));
						})()}
					</tbody>
				</table>
			</div>
		</div>
	);
};

class Bottom extends React.Component {
	state = {
		hasError: false,
	};

	handleSubmit = async event => {
		event.preventDefault();
		this.setState({hasError: false});
		exchangeContainer.setIsSendingOrder(true);

		const {api} = appContainer;
		const {baseCurrency, quoteCurrency} = exchangeContainer.state;
		const {price, amount, total, type} = this.props;

		const requestOpts = {
			type,
			baseCurrency,
			quoteCurrency,
			price: Number(price),
			amount: Number(amount),
			total: Number(total),
		};

		const result = await api.order(requestOpts);

		const orderError = error => {
			// eslint-disable-next-line no-new
			new Notification(t('order.failedTrade', {baseCurrency, type}), {body: error});
			exchangeContainer.setIsSendingOrder(false);
			this.setState({hasError: true});
		};

		// TODO: If we get this error we should probably show a more helpful error
		// and grey out the order form for result.wait seconds.
		// Or alternatively if we know there is a pending trade, prevent them from
		// placing an order until it's matched.
		if (result.error) {
			let {error} = result;
			if (error === 'only one pending request at a time') {
				error = t('order.maxOnePendingSwap', {wait: result.wait});
			}
			orderError(error);
			return;
		}

		// TODO: Temp workaround for marketmaker issue
		if (!result.pending) {
			orderError(t('order.unexpectedError'));
			return;
		}

		const swap = result.pending;
		const {swapDB} = appContainer;
		await swapDB.insertSwapData(swap, requestOpts);
		exchangeContainer.setIsSendingOrder(false);
	};

	targetPriceButtonHandler = () => {
		// TODO: Find a better way to calculate the optimal target price
		const sortOrder = this.props.type === 'buy' ? 'asc' : 'desc';
		const [order] = _.orderBy(this.props.getOrderBook(), ['price'], [sortOrder]);

		if (!order) {
			return;
		}

		this.props.handlePriceChange(order.price);
	};

	maxPriceButtonHandler = () => {
		// This button doesn't make sense without a price set
		if (!this.props.price) {
			this.targetPriceButtonHandler();
		}

		// TODO: Get the txfee: https://github.com/atomiclabs/hyperdex/issues/104
		// Make sure to convert it to the current base currency.
		const txfee = 0;

		const {state} = exchangeContainer;
		if (this.props.type === 'buy') {
			const {balance} = appContainer.getCurrency(state.quoteCurrency);
			this.props.handleTotalChange(balance - txfee);
			return;
		}

		const {balance} = appContainer.getCurrency(state.baseCurrency);
		this.props.handleAmountChange(balance - txfee);
	};

	render() {
		const {state} = exchangeContainer;
		const typeTitled = t(`order.${this.props.type}`);
		const orderBook = this.props.getOrderBook();

		const TargetPriceButton = () => (
			<CrosshairIcon
				className="target-price-button"
				onClick={this.targetPriceButtonHandler}
				disabled={orderBook.length === 0}
				size="13px"
			/>
		);

		const MaxPriceButton = () => (
			<div
				className="max-price-button"
				onClick={this.maxPriceButtonHandler}
				disabled={orderBook.length === 0}
			>
				{t('order.maxPrice')}
			</div>
		);

		const swapWorthInUsd = formatCurrency(Number(this.props.total) * appContainer.getCurrency(state.quoteCurrency).cmcPriceUsd);

		return (
			<div className="bottom">
				<form onSubmit={this.handleSubmit}>
					<h3>{`${typeTitled} ${state.baseCurrency}`}</h3>
					<div className="form-section">
						<label>{t('order.price', {symbol: state.quoteCurrency})}</label>
						<Input
							className="price-input"
							required
							onlyNumeric
							fractionalDigits={8}
							value={this.props.price}
							onChange={this.props.handlePriceChange}
							button={TargetPriceButton}
						/>
					</div>
					<div className="form-section">
						<label>{t('order.amount', {symbol: state.baseCurrency})}</label>
						<Input
							required
							onlyNumeric
							fractionalDigits={8}
							value={this.props.amount}
							onChange={this.props.handleAmountChange}
							button={MaxPriceButton}
						/>
					</div>
					<div className="form-section total-section">
						<label>{t('order.total', {symbol: state.quoteCurrency})}</label>
						<Input
							required
							onlyNumeric
							fractionalDigits={8}
							value={this.props.total}
							onChange={this.props.handleTotalChange}
						/>
						{Number(this.props.total) > 0 &&
							<p className="swap-worth">
								{t('order.worth', {swapWorthInUsd})}
							</p>
						}
					</div>
					<div className="form-section">
						<Button
							className={this.state.hasError ? 'shake-animation' : ''}
							color={this.props.type === 'buy' ? 'green' : 'red'}
							fullwidth
							type="submit"
							value={`${typeTitled} ${state.baseCurrency}`}
							disabled={exchangeContainer.state.isSendingOrder}
						/>
					</div>
				</form>
			</div>
		);
	}
}

class Order extends SuperComponent {
	getInitialState() {
		return {
			// We're using strings and not `input type="number"` because of a React issue:
			// https://github.com/facebook/react/issues/9402
			price: '',
			amount: '',
			total: '',
		};
	}

	currencyChangedListener = () => {
		this.resetState();
	};

	componentDidMount() {
		exchangeContainer.events.on('currency-changed', this.currencyChangedListener);
	}

	componentWillUnmount() {
		exchangeContainer.events.off('currency-changed', this.currencyChangedListener);
	}

	handlePriceChange = price => {
		price = String(price);

		this.setState(prevState => {
			const total = roundTo(Number(price) * Number(prevState.amount), 8);
			const newState = {price, total: String(total)};

			if (total > 0) {
				newState.amount = this.getAmount(total, price);
			}

			return newState;
		});
	}

	handleAmountChange = amount => {
		this.setState(prevState => ({
			amount: String(amount),
			total: String(roundTo(Number(prevState.price) * Number(amount), 8)),
		}));
	}

	handleTotalChange = total => {
		this.setState(prevState => {
			const newState = {total: String(total)};

			if (Number(prevState.price) > 0) {
				newState.amount = this.getAmount(total, prevState.price);
			}

			return newState;
		});
	}

	getAmount = (total, price) => String(roundTo(Number(total) / Number(price), 8));

	getSelectedCurrency = () => {
		const {state} = exchangeContainer;
		const selectedCurrencySymbol = this.props.type === 'buy' ? state.baseCurrency : state.quoteCurrency;
		return appContainer.getCurrency(selectedCurrencySymbol);
	};

	getOrderBook = () => {
		const {state} = exchangeContainer;
		return state.orderBook[this.props.type === 'buy' ? 'asks' : 'bids'];
	};

	render() {
		const {props, state} = this;
		const typeTitled = _.upperFirst(props.type);

		return (
			<div className={`Exchange--${typeTitled}`}>
				<Top
					{...props}
					getSelectedCurrency={this.getSelectedCurrency}
				/>
				<Center
					{...props}
					handlePriceChange={this.handlePriceChange}
					getOrderBook={this.getOrderBook}
				/>
				<Bottom
					{...props}
					{...state}
					handlePriceChange={this.handlePriceChange}
					handleAmountChange={this.handleAmountChange}
					handleTotalChange={this.handleTotalChange}
					getOrderBook={this.getOrderBook}
				/>
			</div>
		);
	}
}

export default Order;
