import React from 'react';
import roundTo from 'round-to';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import TargetPriceButton from 'components/TargetPriceButton';
import CurrencySelectOption from 'components/CurrencySelectOption';
import {exchangeContainer} from 'containers/Exchange';
import './Buy.scss';

class Top extends React.Component {
	handleSelectChange = selectedOption => {
		exchangeContainer.setBaseCurrency(selectedOption.value);
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
					value={state.baseCurrency}
					options={selectData}
					onChange={this.handleSelectChange}
					valueRenderer={CurrencySelectOption}
					optionRenderer={CurrencySelectOption}
					placeholder="Select Base Currency…"
				/>
				<h3 className="balance">Balance: 500 {state.baseCurrency}</h3>
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
		document.querySelector('.Exchange--Buy .price-input input').value = row.price;
	};

	return (
		<div className="center">
			<h3>{state.baseCurrency} Sell Orders</h3>
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
		shouldAutoSplit: false,
		statusMessage: '',
	};

	handleAutoSplitCheckboxChange = checked => {
		this.setState({shouldAutoSplit: checked});
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

	render() {
		const {state} = exchangeContainer;

		const TargetPriceButtonWrapper = () => (
			<TargetPriceButton onClick={this.targetPriceButtonHandler}/>
		);

		return (
			<div className="bottom">
				<form onSubmit={this.handleSubmit}>
					<h3>
						<span>Buy {state.baseCurrency}</span>
						<Checkbox
							className="auto-split-checkbox"
							label="Auto-split"
							checked={this.state.shouldAutoSplit}
							onChange={this.handleAutoSplitCheckboxChange}
						/>
					</h3>
					<div className="form-section">
						<label>Price ({state.quoteCurrency}):</label>
						<Input className="price-input" type="number" min="0" required button={TargetPriceButtonWrapper}/>
					</div>
					<div className="form-section">
						<label>Amount ({state.baseCurrency}):</label>
						<Input type="number" min="0" required/>
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
					<Button green fullwidth type="submit" value={`Buy ${state.baseCurrency}`}/>
				</form>
			</div>
		);
	}
}

const Buy = () => {
	return (
		<div className="Exchange--Buy">
			<Top/>
			<Center/>
			<Bottom/>
		</div>
	);
};

export default Buy;
