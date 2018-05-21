import {api} from 'electron-util';
import React from 'react';
import {classNames} from 'react-extras';
import {Subscribe} from 'unstated';
import {format as formatDate} from 'date-fns';
import appContainer from 'containers/App';
import exchangeContainer from 'containers/Exchange'; // TODO(sindresorhus): Find a better place to have the SwapDB data, since both the Exchange and Trades view uses it
import tradesContainer from 'containers/Trades';
import View from 'components/View';
import AppTabView from './TabView';
import SwapDetails from './Exchange/SwapDetails';
import './Exchange/Swaps.scss';
import './Trades.scss';

const TabButton = props => (
	<span
		className={
			classNames(
				'button',
				{
					active: tradesContainer.state.activeView === props.component.name,
				}
			)
		}
		onClick={() => {
			tradesContainer.setActiveView(props.component.name);
		}}
	>
		{props.title}
	</span>
);

const TabView = ({component}) => (
	<View component={component} activeView={tradesContainer.state.activeView}/>
);

const Empty = () => (
	<div className="Empty">
		<p>No swaps yet</p>
	</div>
);

class CancelButton extends React.Component {
	state = {
		isCancelling: false,
	}

	cancelSwap = async swapUuid => {
		this.setState({isCancelling: true});

		try {
			await appContainer.api.cancelOrder(swapUuid);
		} catch (error) {
			console.error(error);
			api.dialog.showErrorBox('Error', error.message);
		}
	};

	render() {
		const {swap} = this.props;

		return (
			<button
				type="button"
				className="cancel__button"
				disabled={swap.status !== 'pending' || this.state.isCancelling}
				onClick={() => this.cancelSwap(swap.uuid)}
			>
				Cancel
			</button>
		);
	}
}

// TODO(sindresorhus): Consider DRYing this up with the code in `Exchange.js`
const SwapItem = ({swap}) => (
	<tr>
		<td className="timestamp">{formatDate(swap.timeStarted, 'HH:mm DD/MM/YY')}</td>
		<td className="pairs">{swap.baseCurrency}/{swap.quoteCurrency}</td>
		<td className="base-amount">+{swap.baseCurrencyAmount} {swap.baseCurrency}</td>
		<td className="quote-amount">-{swap.quoteCurrencyAmount} {swap.quoteCurrency}</td>
		<td className="status">
			<div className="status__icon" data-status={swap.status}>{swap.statusFormatted}</div>
		</td>
		<td className="view">
			{tradesContainer.state.activeView === 'OpenOrders' ?
				<CancelButton swap={swap}/> :
				<SwapDetails swap={swap}/>
			}
		</td>
	</tr>
);

const SwapList = ({swaps}) => {
	if (swaps.length === 0) {
		return <Empty/>;
	}

	return (
		<div className="SwapList">
			<table>
				<tbody>
					{
						swaps.map(swap => (
							<SwapItem key={swap.uuid} swap={swap}/>
						))
					}
				</tbody>
			</table>
		</div>
	);
};

const OpenOrders = () => {
	const {state} = exchangeContainer;
	const filteredData = state.swapHistory.filter(x => !['completed', 'failed'].includes(x.status));
	return <SwapList swaps={filteredData}/>;
};

const SwapHistory = () => {
	const {state} = exchangeContainer;
	const filteredData = state.swapHistory.filter(x => ['completed', 'failed'].includes(x.status));
	return <SwapList swaps={filteredData}/>;
};

const Trades = () => (
	<Subscribe to={[tradesContainer, /* Temp => */exchangeContainer]}>
		{() => (
			<AppTabView title="Trades" className="Trades">
				<header>
					<nav>
						<TabButton
							title="Open Orders"
							component={OpenOrders}
						/>
						<TabButton
							title="Swap History"
							component={SwapHistory}
						/>
					</nav>
				</header>
				<main>
					<TabView component={OpenOrders}/>
					<TabView component={SwapHistory}/>
				</main>
			</AppTabView>
		)}
	</Subscribe>
);

export default Trades;
