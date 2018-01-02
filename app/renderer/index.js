import electron from 'electron';
import React from 'react';
import {render} from 'react-dom';

const {ipcRenderer: ipc} = electron;
const config = electron.remote.require('./config');

ipc.on('toggle-dark-mode', () => {
	config.set('darkMode', !config.get('darkMode'));
	document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
});

class App extends React.Component {
	render() {
		return (
			<h1>
				{'⚡️ HyperDEX'}
			</h1>
		);
	}
}

render(<App/>, document.querySelector('#app'));
