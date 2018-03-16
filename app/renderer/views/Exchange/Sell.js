import React from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import TargetPriceButton from 'components/TargetPriceButton';
import CurrencySelectOption from 'components/CurrencySelectOption';
import {exchangeContainer} from 'containers/Exchange';
import './Sell.scss';

class Top extends React.Component {
	handleSelectChange = selectedOption => {
		exchangeContainer.setQuoteCurrency(selectedOption.value);
	};

	render() {
		const {state} = exchangeContainer;

		// TODO: Temp data
		const selectData = [
			{
				label: 'Komodo (KMD)',
				value: 'KMD',
			},
			{
				label: 'Bitcoin (BTC)',
				value: 'BTC',
			},
			{
				label: 'Litecoin (LTC)',
				value: 'LTC',
			},
		];

		return (
			<div className="top">
				<Select
					className="currency-selector"
					value={state.quoteCurrency}
					options={selectData}
					onChange={this.handleSelectChange}
					valueRenderer={CurrencySelectOption}
					optionRenderer={CurrencySelectOption}
					placeholder="Select Quote Currency…"
				/>
				<h3 className="balance">Balance: 200 {state.quoteCurrency}</h3>
				<p className="address">1EnJHhq8Jq8vDuZA5ahVh6H4t6jh1mB4rq</p>
			</div>
		);
	}
}

const Center = () => {
	const {state} = exchangeContainer;

	// FIXME: This is just test data
	const data = [
		{
			price: 0.03512,
			amount: 400.8763,
			max: 200.3432,
			total: 48.1232300,
		},
	];
	function roundTo(val, precision) {
		const exponent = precision > 0 ? 'e' : 'e-';
		const exponentNeg = precision > 0 ? 'e-' : 'e';
		precision = Math.abs(precision);
		return Number(Math.sign(val) * (Math.round(Math.abs(val) + exponent + precision) + exponentNeg + precision));
	}
	// Fake data
	for (let i = 0; i < 50; i++) {
		const [row] = data;
		data.push({
			price: roundTo(row.price * Math.random(), 3),
			amount: roundTo(row.amount * Math.random(), 3),
			max: roundTo(row.max * Math.random(), 3),
			total: roundTo(row.total * Math.random(), 3),
		});
	}
	data.unshift();

	const selectRow = row => {
		// TODO(sindresorhus): Fix this. Just doing it easy for now until I know exactly how it will work
		document.querySelector('.Exchange--Sell .price-input input').value = row.price;
	};

	return (
		<div className="center">
			<h3>{state.baseCurrency} Buy Orders</h3>
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Price ({state.quoteCurrency})</th>
							<th>Amount</th>
							<th>Max</th>
							<th>Total ({state.quoteCurrency})</th>
						</tr>
					</thead>
					<tbody>
						{(() => {
							/* eslint-disable react/no-array-index-key */
							return data.map((row, i) => (
								<tr key={i} onClick={() => selectRow(row)}>
									<td>{row.price}</td>
									<td>{row.amount}</td>
									<td>{row.max}</td>
									<td>{row.total}</td>
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

	handleSubmit = event => {
		event.preventDefault();

		// TODO: Remove this, it's just to test message
		this.setState({
			statusMessage: 'Not enough funds. Deposit required.',
		});

		// TODO: Handle submit
	};

	targetPriceButtonHandler = () => {
		console.log('target price button click');
	};

	maxPriceButtonHandler = () => {
		console.log('max price button click');
	};

	render() {
		const {state} = exchangeContainer;

		const TargetPriceButtonWrapper = () => (
			<TargetPriceButton onClick={this.targetPriceButtonHandler}/>
		);

		const MaxPriceButton = () => (
			<div className="max-price-button" onClick={this.maxPriceButtonHandler}>MAX</div>
		);

		return (
			<div className="bottom">
				<form onSubmit={this.handleSubmit}>
					<h3>Sell {state.baseCurrency}</h3>
					<div className="form-section">
						<label>Price ({state.quoteCurrency}):</label>
						<Input className="price-input" type="number" min="0" required button={TargetPriceButtonWrapper}/>
					</div>
					<div className="form-section">
						<label>Amount ({state.baseCurrency}):</label>
						<Input type="number" min="0" required button={MaxPriceButton}/>
					</div>
					<div className="form-section">
						<label>Total ({state.quoteCurrency}):</label>
						<Input type="number" min="0" required/>
					</div>
					{this.state.statusMessage &&
						<p className="secondary status-message">
							{this.state.statusMessage}
						</p>
					}
					<Button red fullwidth type="submit" value={`Sell ${state.baseCurrency}`}/>
				</form>
			</div>
		);
	}
}

const Sell = () => {
	return (
		<div className="Exchange--Sell">
			<Top/>
			<Center/>
			<Bottom/>
		</div>
	);
};

export default Sell;
