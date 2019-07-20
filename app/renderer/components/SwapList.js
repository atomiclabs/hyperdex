import unhandled from 'electron-unhandled';
import React from 'react';
import PropTypes from 'prop-types';
import {format as formatDate} from 'date-fns';
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized';
import _ from 'lodash';
import appContainer from 'containers/App';
import tradesContainer from 'containers/Trades';
import Empty from 'components/Empty';
import SwapDetails from 'components/SwapDetails';
import {translate} from '../translate';
import './SwapList.scss';

const t = translate('swap');

const SortDirections = {
	ASC: Symbol('asc'),
	DESC: Symbol('desc'),
};

// eslint-disable-next-line no-unused-vars
class CancelButton extends React.Component {
	static propTypes = {
		swap: PropTypes.object.isRequired,
	};

	cancelSwap = async swapUuid => {
		await tradesContainer.setIsSwapCancelling(swapUuid, true);
		this.forceUpdate();

		try {
			await appContainer.api.cancelOrder(swapUuid);
		} catch (error) {
			unhandled.logError(error);
		}
	};

	render() {
		const {swap} = this.props;

		return (
			<button
				type="button"
				className="cancel__button"
				disabled={
					swap.status !== 'pending' ||
					tradesContainer.state.isSwapCancelling[swap.uuid]
				}
				onClick={event => {
					event.stopPropagation();
					this.cancelSwap(swap.uuid);
				}}
			>
				{t('list.cancel')}
			</button>
		);
	}
}

const SwapHeaderColumn = ({children, onClick, sortBy, sortDirection, sortKeys, ...props}) => {
	const isSorting = _.isEqual(sortKeys, sortBy);

	return (
		<div {...props} onClick={onClick(sortKeys, isSorting)}>
			{children}
			{isSorting && <span className={`sort ${sortDirection === SortDirections.ASC ? 'asc' : 'desc'}`}/>}
		</div>
	);
};

SwapHeaderColumn.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func.isRequired,
	sortBy: PropTypes.arrayOf(PropTypes.string).isRequired,
	sortDirection: PropTypes.symbol.isRequired,
	sortKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const SwapHeader = props => (
	<div className="row header">
		<SwapHeaderColumn {...props} className="timestamp" sortKeys={['timeStarted']}>
			{t('list.date')}
		</SwapHeaderColumn>
		<SwapHeaderColumn {...props} className="pairs" sortKeys={['baseCurrency', 'quoteCurrency', 'timeStarted']}>
			{t('list.pair')}
		</SwapHeaderColumn>
		<SwapHeaderColumn {...props} className="base-amount" sortKeys={['baseCurrency', 'baseCurrencyAmount', 'timeStarted']}>
			{t('list.baseAmount')}
		</SwapHeaderColumn>
		<SwapHeaderColumn {...props} className="quote-amount" sortKeys={['quoteCurrency', 'quoteCurrencyAmount', 'timeStarted']}>
			{t('list.quoteAmount')}
		</SwapHeaderColumn>
		<SwapHeaderColumn {...props} className="status" sortKeys={['status', 'timeStarted']}>
			{t('list.status')}
		</SwapHeaderColumn>
	</div>
);

// eslint-disable-next-line no-unused-vars
const SwapItem = ({style, swap, showCancel, openSwap}) => (
	<div className={`row ${swap.orderType}`} style={style} onClick={openSwap}>
		<div className="timestamp">{formatDate(swap.timeStarted, 'HH:mm DD/MM/YY')}</div>
		<div className="pairs">{swap.baseCurrency}/{swap.quoteCurrency}</div>
		<div className="base-amount">{swap.baseCurrencyAmount} {swap.baseCurrency}</div>
		<div className="quote-amount">{swap.quoteCurrencyAmount} {swap.quoteCurrency}</div>
		<div className="status">
			<div className="status__icon" data-status={swap.status}>{swap.statusFormatted}</div>
		</div>
		<div className="buttons">
			{
				/* TODO: Add back the cancel button when https://github.com/artemii235/SuperNET/issues/463 is fixed
				showCancel && (
					<div className="cancel">
						<CancelButton swap={swap}/>
					</div>
				)
				*/
			}
		</div>
	</div>
);

SwapItem.propTypes = {
	style: PropTypes.object.isRequired,
	swap: PropTypes.object.isRequired,
	showCancel: PropTypes.bool.isRequired,
	openSwap: PropTypes.func.isRequired,
};

class SwapList extends React.Component {
	static propTypes = {
		showHeader: PropTypes.bool,
		limit: PropTypes.number,
	};

	static defaultProps = {
		showHeader: false,
		limit: undefined,
	};

	state = {
		sortBy: this.props.sortBy,
		sortDirection: this.props.sortDirection,
		openedSwapId: null,
	};

	openSwap = swapId => {
		this.setState({openedSwapId: swapId});
	};

	closeSwap = () => {
		this.setState({openedSwapId: null});
	};

	cache = new CellMeasurerCache({
		fixedWidth: true,
		keyMapper: () => 1, // Only measure height on first item and assume rest has the same
	});

	handleResize = () => {
		this.cache.clearAll();
	}

	handleSort = (sortBy, isSorting) => () => {
		this.setState(state => {
			if (!isSorting) {
				return {
					sortBy,
					sortDirection: SortDirections.ASC,
				};
			}

			if (state.sortDirection === SortDirections.DESC) {
				return {
					sortBy: null,
					sortDirection: null,
				};
			}

			return {
				sortBy,
				sortDirection: state.sortDirection === SortDirections.ASC ? SortDirections.DESC : SortDirections.ASC,
			};
		});
	};

	renderRow = swaps => ({index, key, parent, style}) => {
		const {showCancel} = this.props;
		const swap = swaps[index];
		const openSwap = () => this.openSwap(swap.uuid);

		return (
			<CellMeasurer key={key} cache={this.cache} parent={parent} rowIndex={index}>
				<SwapItem showCancel={showCancel} style={style} swap={swap} openSwap={openSwap}/>
			</CellMeasurer>
		);
	};

	Details = () => (
		<SwapDetails
			swapId={this.state.openedSwapId}
			open={Boolean(this.state.openedSwapId)}
			didClose={this.closeSwap}
		/>
	);

	render() {
		const {Details} = this;
		let {showHeader, swaps, limit} = this.props;
		const {sortBy, sortDirection} = this.state;

		if (swaps.length === 0) {
			return (
				<>
					<Details/>
					<Empty show text={t('list.empty')}/>
				</>
			);
		}

		const shouldLimit = limit && limit < swaps.length;
		if (shouldLimit) {
			swaps = swaps.slice(0, limit);
		}

		if (sortBy) {
			swaps = _.sortBy(swaps, sortBy);
		}

		if (sortDirection === SortDirections.DESC) {
			swaps.reverse();
		}

		return (
			<div className="SwapList">
				<Details/>
				{showHeader && (
					<SwapHeader
						sortBy={sortBy}
						sortDirection={sortDirection}
						onClick={this.handleSort}
					/>
				)}
				<div className="container">
					<AutoSizer onResize={this.handleResize}>
						{({width, height}) => (
							<List
								deferredMeasurementCache={this.cache}
								height={height}
								rowCount={swaps.length}
								rowHeight={this.cache.rowHeight}
								rowRenderer={this.renderRow(swaps)}
								width={width}
							/>
						)}
					</AutoSizer>
				</div>
			</div>
		);
	}
}

SwapList.propTypes = {
	swaps: PropTypes.arrayOf(PropTypes.object).isRequired,
	showCancel: PropTypes.bool,
	sortBy: PropTypes.arrayOf(PropTypes.string),
	sortDirection: PropTypes.symbol,
};

SwapList.defaultProps = {
	showCancel: false,
	sortBy: [
		'timeStarted',
	],
	sortDirection: SortDirections.DESC,
};

export default SwapList;

export {
	SortDirections,
};
