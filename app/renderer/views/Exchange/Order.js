import React from 'react';
import roundTo from 'round-to';
import _ from 'lodash';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import CurrencySelectOption from 'components/CurrencySelectOption';
import exchangeContainer from 'containers/Exchange';
import appContainer from 'containers/App';
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
		statusMessage: '',
	};

	handleSubmit = async event => {
		event.preventDefault();
		this.setState({statusMessage: ''});
		exchangeContainer.setIsSendingOrder(true);

		const {api} = appContainer;

		const {type} = this.props;
		const {baseCurrency, quoteCurrency} = exchangeContainer.state;
		const {price, amount, total} = this.props;

		const requestOpts = {
			type,
			baseCurrency,
			quoteCurrency,
			price,
			amount,
			total,
		};

		const result = await api.order(requestOpts);

		// TODO: If we get this error we should probably show a more helpful error
		// and grey out the order form for result.wait seconds.
		// Or alternatively if we know there is a pending trade, prevent them from
		// placing an order until it's matched.
		if (result.error) {
			let statusMessage = result.error;
			if (result.error === 'only one pending request at a time') {
				statusMessage = `Only one pending swap at a time, try again in ${result.wait} seconds.`;
			}
			this.setState({statusMessage});
			exchangeContainer.setIsSendingOrder(false);
			return;
		}

		// TODO: Temp workaround for marketmaker issue
		if (!result.pending) {
			this.setState({statusMessage: 'Something unexpected happened. Are you sure you have enough UTXO?'});
			exchangeContainer.setIsSendingOrder(false);
			return;
		}

		const swap = result.pending;
		const swapDB = await appContainer.getSwapDB;
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

		// TODO: Get the txfee: https://github.com/lukechilds/hyperdex/issues/104
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
					<div className="form-section">
						<label>Total ({state.quoteCurrency}):</label>
						<Input
							required
							onlyNumeric
							fractionalDigits={8}
							value={String(this.props.total)}
							onChange={this.props.handleTotalChange}
						/>
					</div>
					<div className="form-section">
						{this.state.statusMessage &&
							<p className="secondary status-message">
								{this.state.statusMessage}
							</p>
						}
					</div>
					<div className="form-section">
						<Button
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
		total: 0,
	};

	handlePriceChange = price => {
		this.setState(prevState => ({
			price,
			total: roundTo(Number(price) * Number(prevState.amount), 8),
		}));

		if (this.state.total > 0) {
			this.handleTotalChange(this.state.total);
		} else if (Number(this.state.amount) > 0) {
			this.handleAmountChange(this.state.amount);
		}
	}

	handleAmountChange = amount => {
		this.setState(prevState => ({
			amount: String(amount),
			total: roundTo(Number(prevState.price) * Number(amount), 8),
		}));
	}

	handleTotalChange = total => {
		this.setState(prevState => {
			const newState = {total};
			if (prevState.price > 0) {
				newState.amount = String(roundTo(total / prevState.price, 8));
			}

			return newState;
		});
	}

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
