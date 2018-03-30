import Emittery from 'emittery';
import pEvent from 'p-event';
import readBlob from 'read-blob';

class MarketmakerSocket {
	constructor(endpoint) {
		this._ws = new WebSocket(endpoint, ['pair.sp.nanomsg.org']);
		this.connected = pEvent(this._ws, 'open');

		const ee = new Emittery();
		this._ee = ee;
		this.on = ee.on.bind(ee);
		this.off = ee.off.bind(ee);
		this.once = ee.once.bind(ee);

		this._ws.addEventListener('message', this._handleMessage);
	}

	_handleMessage = async event => {
		const json = await readBlob.text(event.data);
		const data = JSON.parse(json);
		const queueId = data.queueid;
		const message = data.result;

		if (queueId > 0) {
			this._ee.emit(`id_${queueId}`, message);
		}

		this._ee.emit('message', message);
	}

	getResponse = queueId => this._ee.once(`id_${queueId}`);

	// Returns an EventEmitter that will emit events as the status of the swap progresses
	// Important events:
	//  - 'progress': All messages related to the swap.
	//  - 'connected': The swap has been matched.
	//  - 'update': The atomic swap has advanced a step, the step flag is in the `update` property.
	//  - 'finished': The atomic swap level has successfully completed.
	//  - 'failed': The atomic swap has failed, the error code is in the property `error`.
	//
	// Any other message with a `method` property will also be emitted via en event of the same name.
	subscribeToSwap(swap) {
		const swapEmitter = new Emittery();

		const generateListener = props => message => {
			const match = Object.entries(props).every(([prop, value]) => message[prop] === value);
			if (!match) {
				return;
			}
			swapEmitter.emit('progress', message);
			if (message.method) {
				swapEmitter.emit(message.method, message);
			}
			if (message.method === 'tradestatus' && message.status === 'finished') {
				swapEmitter.emit('finished', message);
			}
		};

		(async () => {
			const {tradeid, aliceid} = swap;
			const stopLocalListener = this.on('message', generateListener({tradeid, aliceid}));

			const {requestid, quoteid} = await swapEmitter.once('connected');
			stopLocalListener();
			const stopNetworkListener = this.on('message', generateListener({requestid, quoteid}));

			await swapEmitter.once('finished');
			stopNetworkListener();
		})();

		return swapEmitter;
	}
}

export default MarketmakerSocket;
