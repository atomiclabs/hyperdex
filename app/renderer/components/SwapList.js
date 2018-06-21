import {api} from 'electron-util';
import React from 'react';
import {format as formatDate} from 'date-fns';
import appContainer from 'containers/App';
import Empty from 'components/Empty';
import SwapDetails from 'components/SwapDetails';
import './SwapList.scss';

// eslint-disable-next-line no-unused-vars
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

const SwapItem = ({swap}) => (
	<div className={`row ${swap.orderType}`}>
		<div className="timestamp">{formatDate(swap.timeStarted, 'HH:mm DD/MM/YY')}</div>
		<div className="pairs">{swap.baseCurrency}/{swap.quoteCurrency}</div>
		<div className="base-amount">{swap.baseCurrencyAmount} {swap.baseCurrency}</div>
		<div className="quote-amount">{swap.quoteCurrencyAmount} {swap.quoteCurrency}</div>
		<div className="status">
			<div className="status__icon" data-status={swap.status}>{swap.statusFormatted}</div>
		</div>
		<div className="buttons">
			{/* Disabled until marketmaker v2
				See: https://github.com/hyperdexapp/hyperdex/issues/262#issuecomment-396587751showCancel
				&&
				<div className="cancel">
					<CancelButton swap={swap}/>
				</div>
			*/}
			<div className="view">
				<SwapDetails swap={swap}/>
			</div>
		</div>
	</div>
);

const SwapList = ({swaps, showCancel}) => {
	if (swaps.length === 0) {
		return <Empty show text="No swaps yet"/>;
	}

	return (
		<div className="SwapList">
			{
				swaps.map(swap => (
					<SwapItem
						key={swap.uuid}
						swap={swap}
						showCancel={showCancel}
					/>
				))
			}
		</div>
	);
};

export default SwapList;
