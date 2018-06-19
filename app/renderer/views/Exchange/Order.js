import React from 'react';
import roundTo from 'round-to';
import _ from 'lodash';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import CurrencySelectOption from 'components/CurrencySelectOption';
import exchangeContainer from 'containers/Exchange';
import appContainer from 'containers/App';
import {formatCurrency} from '../../util';
import './Order.scss';

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
				<h3 className="balance">Balance: {roundTo(selectedCurrency.balance, 8)} {selectedCurrency.symbol}</h3>
				<p className="address">{selectedCurrency.address}</p>
			</div>
		);
	}
}

const Center = props => {
	const {state} = exchangeContainer;

	// TODO: This should be fixed properly in mm or use more sensible logic here
	// This is just a quick fix to increase match rate for a demo
	const selectRow = row => props.handlePriceChange(row.price * 1.05);

	return (
		<div className="center">
			<h3>{`${state.baseCurrency} ${props.type === 'buy' ? 'Sell' : 'Buy'} Orders`}</h3>
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Price ({state.quoteCurrency})</th>
							<th>Avg Vol</th>
							<th>Max Vol</th>
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
			new Notification(`Failed to ${type} ${baseCurrency}`, {body: error});
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
				error = `Only one pending swap at a time, try again in ${result.wait} seconds.`;
			}
			orderError(error);
			return;
		}

		// TODO: Temp workaround for marketmaker issue
		if (!result.pending) {
			orderError('Something unexpected happened. Are you sure you have enough UTXO?');
			return;
		}

		const swap = result.pending;
		const {swapDB} = appContainer;
		api.subscribeToSwap(swap.uuid).on('progress', swapDB.updateSwapData);
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

		// TODO: Get the txfee: https://github.com/hyperdexapp/hyperdex/issues/104
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
		const typeTitled = _.upperFirst(this.props.type);
		const orderBook = this.props.getOrderBook();

		const TargetPriceButton = () => (
			<div
				className="target-price-button"
				onClick={this.targetPriceButtonHandler}
				disabled={orderBook.length === 0}
			>
				<img src="/assets/crosshair-icon.svg"/>
			</div>
		);

		const MaxPriceButton = () => (
			<div
				className="max-price-button"
				onClick={this.maxPriceButtonHandler}
				disabled={orderBook.length === 0}
			>
				MAX
			</div>
		);

		const swapWorthInUsd = formatCurrency(Number(this.props.total) * appContainer.getCurrency(state.quoteCurrency).cmcPriceUsd);

		return (
			<div className="bottom">
				<form onSubmit={this.handleSubmit}>
					<h3>{`${typeTitled} ${state.baseCurrency}`}</h3>
					<div className="form-section">
						<label>Price ({state.quoteCurrency}):</label>
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
						<label>Amount ({state.baseCurrency}):</label>
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
						<label>Total ({state.quoteCurrency}):</label>
						<Input
							required
							onlyNumeric
							fractionalDigits={8}
							value={this.props.total}
							onChange={this.props.handleTotalChange}
						/>
						{Number(this.props.total) > 0 &&
							<p className="swap-worth">
								This swap is worth {swapWorthInUsd}
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

class Order extends React.Component {
	state = {
		// We're using strings and not `input type="number"` because of a React issue:
		// https://github.com/facebook/react/issues/9402
		price: '',
		amount: '',
		total: '',
	};

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
