import electron from 'electron';
import React from 'react';
import {render} from 'react-dom';
import Api from './api';

require('electron-unhandled')();

const {ipcRenderer: ipc} = electron;
const config = electron.remote.require('./config');

const applyDarkMode = () => {
	document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
};

ipc.on('toggle-dark-mode', () => {
	config.set('darkMode', !config.get('darkMode'));
	applyDarkMode();
});

applyDarkMode();

class App extends React.Component {
	render() {
		return (
			<h1>
				{'⚡️ HyperDEX'}
			</h1>
		);
	}
}

render(<App/>, document.querySelector('#root'));

function initMarketmaker() {
	// TODO: This is only temporary for testing
	// Make sure BarterDEX is running first:
	// docker run -e PASSPHRASE="secure passphrase" -p 127.0.0.1:7783:7783 lukechilds/barterdex-api
	const PASSPHRASE = 'secure passphrase';

	electron.ipcRenderer.send('start-marketmaker', {passphrase: PASSPHRASE});

	electron.ipcRenderer.on('marketmaker-started', async (event, port) => { // eslint-disable-line no-unused-vars
		const api = new Api({
			endpoint: `http://localhost:7783`,
			// - endpoint: `http://localhost:${port}`,
			passphrase: PASSPHRASE
		});

		console.log('Portfolio:', await api.portfolio());
		console.log('Coins:', (await api.coins())[0]);
	});
}

initMarketmaker();
