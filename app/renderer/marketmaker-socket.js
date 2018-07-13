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
}

export default MarketmakerSocket;
