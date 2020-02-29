import React from 'react';
import PropTypes from 'prop-types';
import roundTo from 'round-to';
import _ from 'lodash';
import SuperComponent from 'components/SuperComponent';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import CurrencySelectOption from 'components/CurrencySelectOption';
import exchangeContainer from 'containers/Exchange';
import appContainer from 'containers/App';
import tradesContainer from 'containers/Trades';
import CrosshairIcon from 'icons/Crosshair';
import {getCurrency} from '../../../marketmaker/supported-currencies';
import {formatCurrency} from '../../util';
import {translate} from '../../translate';
import './Order.scss';

// TODO: This should be fixed properly in mm or use more sensible logic here
// This is just a quick fix to increase match rate
const percentMoreExpensive = 0.1 / 100;

const isEthBased = symbol => {
	const currency = getCurrency(symbol);

	return !!currency.contractAddress;
};

const t = translate('exchange');

class Top extends React.Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		getSelectedCurrency: PropTypes.func.isRequired,
	};

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
					searchable
					className="currency-selector"
					value={selectedCurrency.symbol}
					options={selectData}
					valueRenderer={CurrencySelectOption}
					optionRenderer={CurrencySelectOption}
					onChange={this.handleSelectChange}
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
							<th>{t('order.maxVolume')}</th>
						</tr>
					</thead>
					<tbody>
						{(() => {
							/* eslint-disable react/no-array-index-key */
							return props.getOrderBook().map((row, i) => (
								<tr key={i} onClick={() => selectRow(row)}>
									<td>{row.price}</td>
									<td>{roundTo(parseFloat(row.maxVolume), 8)}</td>
								</tr>
							));
							/* eslint-enable react/no-array-index-key */
						})()}
					</tbody>
				</table>
			</div>
		</div>
	);
};

Center.propTypes = {
	type: PropTypes.string.isRequired,
	handlePriceChange: PropTypes.func.isRequired,
	getOrderBook: PropTypes.func.isRequired,
};

class Bottom extends React.Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		getOrderBook: PropTypes.func.isRequired,
		handlePriceChange: PropTypes.func.isRequired,
		handleTotalChange: PropTypes.func.isRequired,
		handleAmountChange: PropTypes.func.isRequired,
		price: PropTypes.string.isRequired,
		amount: PropTypes.string.isRequired,
		total: PropTypes.string.isRequired,
	};

	state = {
		hasError: false,
	};

	handleSubmit = async event => {
		event.preventDefault();
		this.setState({hasError: false});
		exchangeContainer.setIsSendingOrder(true);

		const {api, state: appState, swapDB} = appContainer;

		const {baseCurrency, quoteCurrency} = exchangeContainer.state;
		const {price, amount, total, type} = this.props;

		const {currencies} = appState;
		const base = isEthBased(quoteCurrency) ? quoteCurrency : baseCurrency;
		const isECR20 = isEthBased(quoteCurrency) || isEthBased(baseCurrency);
		const balanceOfEthereum = currencies.find(o => o && o.coin === 'ETH');
		const openOrders = appState.ordersHistory
		.filter(order => order.status === 'active')
		.filter(order => baseCurrency === order.baseCurrency && quoteCurrency === order.quoteCurrency)
		.map(order => order.uuid);

		// NOTE: we only allow one order for one pair for now
		// Cancel prev order in same orderbook
		for(let i = 0; i < openOrders.length; i++) {
			try {
				await tradesContainer.setIsSwapCancelling(openOrders[i], true);
				await api.cancelOrder(openOrders[i]);
				await swapDB.updateOrderStatus(openOrders[i], 'cancelled');
			} catch (error) {
				// Note: we ignore all error
				console.log('open new order', error);
			}
		}

		this.forceUpdate();

		const orderError = error => {
			// eslint-disable-next-line no-new
			new Notification(t('order.failedTrade', {baseCurrency, type}), {body: error});
			exchangeContainer.setIsSendingOrder(false);
			this.setState({hasError: true});
		};

		const requestOpts = {
			type,
			baseCurrency,
			quoteCurrency,
			price: Number(price),
			volume: Number(amount),
		};

		let swap;
		try {
			if(isECR20 && !balanceOfEthereum){
				throw new Error(`${base} is ECR20 token, please enable ETH coin first.`);
			}
			if(isECR20 && balanceOfEthereum.balance < 0.001) {
				throw new Error(`ETH balance 0 is too low to cover gas fee, required 0.001`);
			}
			swap = await api.order(requestOpts);
		} catch (error) {
			console.log('open new order', error);
			orderError(error);
			return;
		}

		// This one is not needed by the mm v2 call, but we add it for the swap progress.
		requestOpts.total = Number(total);

		// We also rename back the property until we can refactor it all.
		requestOpts.amount = requestOpts.volume;
		delete requestOpts.volume;

		// NOTE: new api
		await swapDB.insertOrderData(swap, requestOpts);
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
				disabled={orderBook.length === 0}
				size="13px"
				onClick={this.targetPriceButtonHandler}
			/>
		);

		const MaxPriceButton = () => (
			<div
				className="max-price-button"
				disabled={orderBook.length === 0}
				onClick={this.maxPriceButtonHandler}
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
							required
							onlyNumeric
							className="price-input"
							fractionalDigits={8}
							value={this.props.price}
							button={TargetPriceButton}
							onChange={this.props.handlePriceChange}
						/>
					</div>
					<div className="form-section">
						<label>{t('order.amount', {symbol: state.baseCurrency})}</label>
						<Input
							required
							onlyNumeric
							fractionalDigits={8}
							value={this.props.amount}
							button={MaxPriceButton}
							onChange={this.props.handleAmountChange}
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
							fullwidth
							className={this.state.hasError ? 'shake-animation' : ''}
							color={this.props.type === 'buy' ? 'green' : 'red'}
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
