import electron from 'electron';
import React from 'react';
import {render} from 'react-dom';
import Api from './api';
import App from './app';

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

render(<App/>, document.querySelector('#root'));

function initMarketmaker() {
	// TODO: This is only temporary for testing
	// Make sure BarterDEX is running first:
	// docker run -e PASSPHRASE="secure passphrase" -p 127.0.0.1:7783:7783 lukechilds/barterdex-api
	// We call `PASSPHRASE` for `SEED_PHRASE` for clarity of what it actually is
	const SEED_PHRASE = 'secure passphrase';

	electron.ipcRenderer.send('start-marketmaker', {seedPhrase: SEED_PHRASE});

	electron.ipcRenderer.on('marketmaker-started', async (event, port) => {
		const api = new Api({
			endpoint: `http://localhost:${port}`,
			seedPhrase: SEED_PHRASE
		});

		console.log('Portfolio:', await api.portfolio());
		console.log('Coins:', (await api.coins())[0]);
	});
}

initMarketmaker();
