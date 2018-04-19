import React from 'react';
import roundTo from 'round-to';
import _ from 'lodash';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import TargetPriceButton from 'components/TargetPriceButton';
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
		const {state} = exchangeContainer;

		const {currencies} = appContainer.state;
		const selectedCurrencySymbol = this.props.type === 'buy' ? state.baseCurrency : state.quoteCurrency;
		const selectedCurrency = appContainer.getCurrency(selectedCurrencySymbol);

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
				<h3 className="balance">Balance: {roundTo(selectedCurrency.balance, 8)} {selectedCurrencySymbol}</h3>
				<p className="address">{selectedCurrency.address}</p>
			</div>
		);
	}
}

const Center = props => {
	const {state} = exchangeContainer;

	const data = state.orderBook[props.type === 'buy' ? 'asks' : 'bids'];

	const selectRow = row => props.handlePriceChange(row.price);

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
							return data.map((row, i) => (
								<tr key={i} onClick={() => selectRow(row)}>
									<td>{row.price}</td>
									<td>{roundTo(row.avevolume, 8)}</td>
									<td>{roundTo(row.maxvolume, 8)}</td>
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
			return;
		}

		// TODO: Temp workaround for marketmaker issue
		if (!result.pending) {
			this.setState({statusMessage: 'Something unexpected happened. Are you sure you have enough UTXO?'});
			return;
		}

		this.setState({statusMessage: ''});

		const swap = result.pending;

		const swapDB = await appContainer.getSwapDB;
		swapDB.insertSwap(swap, requestOpts);
		api.subscribeToSwap(swap.uuid).on('progress', swapDB.updateSwap);
	};

	targetPriceButtonHandler = () => {
		console.log('target price button click');
	};

	maxPriceButtonHandler = () => {
		console.log('max price button click');
	};

	render() {
		const {state} = exchangeContainer;
		const typeTitled = _.upperFirst(this.props.type);

		const TargetPriceButtonWrapper = () => (
			<TargetPriceButton onClick={this.targetPriceButtonHandler}/>
		);

		const MaxPriceButton = () => (
			<div className="max-price-button" onClick={this.maxPriceButtonHandler}>MAX</div>
		);

		return (
			<div className="bottom">
				<form onSubmit={this.handleSubmit}>
					<h3>{`${typeTitled} ${state.baseCurrency}`}</h3>
					<div className="form-section">
						<label>Price ({state.quoteCurrency}):</label>
						<Input className="price-input" type="number" min="0" step="any" required value={this.props.price} onChange={this.props.handlePriceChange} button={TargetPriceButtonWrapper}/>
					</div>
					<div className="form-section">
						<label>Amount ({state.baseCurrency}):</label>
						<Input type="number" min="0" step="any" required value={this.props.amount} onChange={this.props.handleAmountChange} button={MaxPriceButton}/>
					</div>
					<div className="form-section">
						<label>Total ({state.quoteCurrency}):</label>
						<Input type="number" min="0" step="any" required value={this.props.total} onChange={this.props.handleTotalChange}/>
					</div>
					<div className="form-section">
						{this.state.statusMessage &&
							<p className="secondary status-message">
								{this.state.statusMessage}
							</p>
						}
					</div>
					<div className="form-section">
						<Button color={this.props.type === 'buy' ? 'green' : 'red'} fullwidth type="submit" value={`${typeTitled} ${state.baseCurrency}`}/>
					</div>
				</form>
			</div>
		);
	}
}

class Order extends React.Component {
	state = {
		price: 0,
		amount: 0,
		total: 0,
	};

	handlePriceChange = price => {
		// TODO: The `price`, `amount`, and `total` will will sometimes have leading 0s in the DOM
		// even though we remove them in React state.
		// This is a known React bug and should be fixed soon.
		// https://github.com/facebook/react/issues/9402
		price = (price === '') ? '' : roundTo(Number(price), 8);
		this.setState(prevState => ({
			price,
			total: roundTo(price * prevState.amount, 8),
		}));

		this.setState({price});
		if (this.state.total > 0) {
			this.handleTotalChange(this.state.total);
		} else if (this.state.amount > 0) {
			this.handleAmountChange(this.state.amount);
		}
	}

	handleAmountChange = amount => {
		amount = (amount === '') ? '' : roundTo(Number(amount), 8);
		this.setState(prevState => ({
			amount,
			total: roundTo(prevState.price * amount, 8),
		}));
	}

	handleTotalChange = total => {
		total = (total === '') ? '' : roundTo(Number(total), 8);
		this.setState(prevState => {
			const newState = {total};
			if (prevState.price > 0) {
				newState.amount = roundTo(total / prevState.price, 8);
			}

			return newState;
		});
	}

	render() {
		const {props, state} = this;
		const typeTitled = _.upperFirst(props.type);

		return (
			<div className={`Exchange--${typeTitled}`}>
				<Top {...props}/>
				<Center
					{...props}
					handlePriceChange={this.handlePriceChange}
				/>
				<Bottom
					{...props}
					{...state}
					handlePriceChange={this.handlePriceChange}
					handleAmountChange={this.handleAmountChange}
					handleTotalChange={this.handleTotalChange}
				/>
			</div>
		);
	}
}

export default Order;
