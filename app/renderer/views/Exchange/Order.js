import React from 'react';
import roundTo from 'round-to';
import coins from 'coinlist';
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
		const selectedCurrency = currencies.find(currency => currency.coin === selectedCurrencySymbol);

		const selectData = currencies.map(currency => ({
			label: `${coins.get(currency.coin, 'name') || currency.coin} (${currency.coin})`,
			value: currency.coin,
		}));

		return (
			<div className="top">
				<Select
					className="currency-selector"
					value={selectedCurrency.coin}
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

	const selectRow = row => {
		// TODO(sindresorhus): Fix this. Just doing it easy for now until I know exactly how it will work
		document.querySelector(`.Exchange--${_.upperFirst(props.type)} .price-input input`).value = row.price;
	};

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
		price: 0,
		amount: 0,
		total: 0,
	};

	handleSubmit = async event => {
		event.preventDefault();

		const {type} = this.props;
		const {baseCurrency, quoteCurrency} = exchangeContainer.state;
		const {price, amount, total} = this.state;

		const result = await api.order({
			type,
			baseCurrency,
			quoteCurrency,
			price,
			amount,
			total,
		});

		// TODO: If we get this error we should probably show a more helpful error
		// and grey out the order form for result.wait seconds.
		// Or alternatively if we know there is a pending trade, prevent them from
		// placing an order until it's matched.
		if (result.error) {
			let statusMessage = result.error;
			if (result.error === 'only one pending request at a time') {
				statusMessage = `Only one pending trade at a time, try again in ${result.wait} seconds.`;
			}
			return this.setState({statusMessage});
		}

		this.setState({statusMessage: ''});

		// TODO: Track this in a local DB
		const trade = result.pending;
		console.log(trade);
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
		this.setState(prevState => ({
			total,
			amount: roundTo(total / prevState.price, 8),
		}));
	}

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
						<Input className="price-input" type="number" min="0" step="any" required value={this.state.price} onChange={this.handlePriceChange} button={TargetPriceButtonWrapper}/>
					</div>
					<div className="form-section">
						<label>Amount ({state.baseCurrency}):</label>
						<Input type="number" min="0" step="any" required value={this.state.amount} onChange={this.handleAmountChange} button={MaxPriceButton}/>
					</div>
					<div className="form-section">
						<label>Total ({state.quoteCurrency}):</label>
						<Input type="number" min="0" step="any" required value={this.state.total} onChange={this.handleTotalChange}/>
					</div>
					{this.state.statusMessage &&
						<p className="secondary status-message">
							{this.state.statusMessage}
						</p>
					}
					<Button color={this.props.type === 'buy' ? 'green' : 'red'} fullwidth type="submit" value={`${typeTitled} ${state.baseCurrency}`}/>
				</form>
			</div>
		);
	}
}

const Order = props => {
	const typeTitled = _.upperFirst(props.type);

	return (
		<div className={`Exchange--${typeTitled}`}>
			<Top {...props}/>
			<Center {...props}/>
			<Bottom {...props}/>
		</div>
	);
};

export default Order;
