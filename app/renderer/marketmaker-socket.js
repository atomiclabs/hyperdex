import Emittery from 'emittery';

class MarketmakerSocket {
	constructor(endpoint) {
		this._ws = new WebSocket(endpoint, ['pair.sp.nanomsg.org']);
		this.connected = new Promise(resolve => this._ws.addEventListener('open', resolve));

		const ee = new Emittery();
		this._ee = ee;
		this.on = ee.on.bind(ee);
		this.off = ee.off.bind(ee);
		this.once = ee.once.bind(ee);

		this._ws.addEventListener('message', this._handleMessage.bind(this));
	}

	async _handleMessage(event) {
		const data = await this._parseData(event.data);
		const queueid = Number(data.result.queueid);
		const message = data.result;

		if (queueid > 0) {
			this._ee.emit(`id_${queueid}`, message);
		}

		this._ee.emit('message', message);
	}

	_parseData(data) {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.addEventListener('loadend', () => {
				const parsedData = JSON.parse(reader.result);
				resolve(parsedData);
			});
			reader.readAsText(data);
		});
	}

	getResponse(queueid) {
		return this._ee.once(`id_${queueid}`);
	}
}

export default MarketmakerSocket;
