import electron from 'electron';
import React from 'react';
import {render} from 'react-dom';

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
	const PASSPHRASE = 'test';

	electron.ipcRenderer.send('start-marketmaker', {passphrase: PASSPHRASE});

	electron.ipcRenderer.on('marketmaker-started', async (event, port) => {
		const Api = electron.remote.require('./api');
		const api = new Api({
			endpoint: `http://localhost:${port}`,
			passphrase: PASSPHRASE
		});

		console.log('Portfolio:', await api.portfolio());
		console.log('Coins:', (await api.coins())[0]);
	});
}

initMarketmaker();
