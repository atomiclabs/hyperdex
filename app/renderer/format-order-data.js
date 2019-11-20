import roundTo from 'round-to';
import {isAfter} from 'date-fns';
import {appTimeStarted} from '../constants';
import {translate} from './translate';

const t = translate('swap');

export default function formatOrder(data) {
	const {
		uuid,
		timeStarted,
		request,
		response,
		status,
		type,
		swaps,
    	startedSwaps
	} = data;

	const {
		action,
		base: baseCurrency,
		rel: quoteCurrency,
		baseAmount,
		quoteAmount,
	} = response;

	const order = {
		uuid,
		timeStarted,
		action: action === 'Buy' ? 'buy' : 'sell', // This is swap type
		orderType: type,
		status,
		statusFormatted: t(`status.${status}`).toLowerCase(),
		error: false,
		// NOTE: this is swap field, we should remove this when atomiclabs#615 is solved
		progress: 0,
		baseCurrency,
		quoteCurrency,
		baseCurrencyAmount: roundTo(baseAmount, 8),
		quoteCurrencyAmount: roundTo(quoteAmount, 8),
		price: roundTo(quoteAmount / baseAmount, 8),
		requested: {
			baseCurrencyAmount: roundTo(request.amount, 8),
			quoteCurrencyAmount: roundTo(request.total, 8),
			price: roundTo(request.price, 8),
		},
		broadcast: {
			baseCurrencyAmount: roundTo(baseAmount, 8),
			quoteCurrencyAmount: roundTo(quoteAmount, 8),
			price: roundTo(quoteAmount / baseAmount, 8),
		},
		executed: {
			baseCurrencyAmount: undefined,
			quoteCurrencyAmount: undefined,
			price: undefined,
			percentCheaperThanRequested: undefined,
		},
		// totalStages: [],
		// stages: [],
		_debug: {
			request,
			response,
			// swapData,
		},
		startedSwaps,
		get isOpen() {
			return this.status === 'active' || order.status === 'matched';
		},
		get receivedByMe() {
			return this.swaps.reduce((accumulator, currentValue) => {
				return accumulator + currentValue.receivedByMe;
			}, 0);
		},
		get isActive() {
			if(this.status === "active") {
				return true;
			}
			const swaps = this.startedSwaps.map(e => formatSwap(this.originSwapsField[e]));
			const activeSwaps = swaps.filter(e => {
				if(!e) return true;
				return ['failed', 'completed'].indexOf(e.status) === -1;
			});
			return activeSwaps.length > 0;
		}
	};

	order.originSwapsField = swaps

	order.swaps = startedSwaps
	.map(e => formatSwap(swaps[e]))
	.filter(el => el); // remove undefined

	return order;
}

export function formatSwap(data) {
	if(!data) return null;

	const {
		uuid,
		events,
		error_events: errorEvents,
		success_events: successEvents,
	} = data;

	const swap = {
		uuid,
		status: 'pending',
		statusFormatted: t('status.open').toLowerCase(),
		cacheReceivedByMeAmount: 0,
		get receivedByMe() {
			if(this.cacheReceivedByMeAmount > 0) return this.cacheReceivedByMeAmount;

			const finishedStage = this.totalStages.indexOf('TakerFeeSent') !== -1 ? 'MakerPaymentSpent' : 'TakerPaymentSpent';
			const stage = this.stages.find(({ event }) => {
				return finishedStage === event.type;
			});
			if(!stage) {
				// if not found
				return 0;
			}
			const {event} = stage;
			this.cacheReceivedByMeAmount = parseFloat(event.data.received_by_me) + parseFloat(event.data.fee_details.amount);
			return this.cacheReceivedByMeAmount;
		}
	};

	const failedEvent = events.find(event => errorEvents.includes(event.event.type));
	const nonSwapEvents = ['Started', 'Negotiated', 'Finished'];
	const totalSwapEvents = successEvents.filter(type => !nonSwapEvents.includes(type));
	const swapEvents = events.filter(event => (
		!nonSwapEvents.includes(event.event.type) &&
		!errorEvents.includes(event.event.type)
	));
	const isFinished = !failedEvent && events.some(event => event.event.type === 'Finished');
	const isSwapping = !failedEvent && !isFinished && swapEvents.length > 0;
	const maxSwapProgress = 0.8;
	const newestEvent = events[events.length - 1];

	// Console.log('failedEvent', failedEvent);
	// console.log('totalSwapEvents', totalSwapEvents);
	// console.log('swapEvents', swapEvents);
	// console.log('isFinished', isFinished);
	// console.log('isSwapping', isSwapping);

	swap.totalStages = totalSwapEvents;
	swap.stages = swapEvents;

	if (failedEvent) {
		swap.status = 'failed';
		swap.progress = 1;

		swap.error = {
			code: failedEvent.event.type,
			message: failedEvent.event.data.error,
		};
	} else if (isFinished) {
		swap.status = 'completed';
		swap.progress = 1;
	} else if (isSwapping) {
		swap.status = 'swapping';
		swap.statusFormatted = `swap ${swapEvents.length}/${totalSwapEvents.length}`;
		swap.progress = 0.1 + ((swapEvents.length / totalSwapEvents.length) * maxSwapProgress);
	} else if (newestEvent && newestEvent.event.type === 'Negotiated') {
		swap.status = 'matched';
		swap.progress = 0.1;
	}

	// TODO(sindresorhus): I've tried to preserve the existing behavior when using mm2. We should probably update the events and naming for mm2 conventions though.

	if (!isSwapping) {
		swap.statusFormatted = t(`status.${swap.status}`).toLowerCase();
	}


	// if (swap.status === 'pending') {
	// 	swap.statusFormatted = t('status.open').toLowerCase();
	// }

	// Show open orders from previous session as cancelled
	const cancelled = swap.status === 'pending' && isAfter(appTimeStarted, swap.timeStarted);
	if (cancelled) {
		swap.status = 'failed';
		swap.error = {
			code: undefined,
			message: undefined,
		};
		swap.statusFormatted = t('status.cancelled').toLowerCase();
	}

	// Console.log('progress', swap.progress);

	return swap;
}
