import electron, {remote, ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import _ from 'lodash';
import fireEvery from '../fire-every';
import Container from './Container';

const config = remote.require('./config');

class AppContainer extends Container {
	state = {
		activeView: 'Login',
	};

	setActiveView(activeView) {
		this.setState({activeView});
	}

	logIn({portfolio, api}) {
		this.api = api;

		this.setState({
			activeView: 'Dashboard',
			portfolio,
		});
	}

	// TODO: We should use the portfolio socket event instead once it's implemented
	async watchCurrencies() {
		if (!this.stopWatchingCurrencies) {
			this.stopWatchingCurrencies = await fireEvery(async () => {
				const {portfolio: currencies} = await api.portfolio();
				if (!_.isEqual(this.state.currencies, currencies)) {
					this.setState({currencies});
				}
			}, 1000);
		}

		return this.stopWatchingCurrencies;
	}

	logOut() {
		config.set('windowState', remote.getCurrentWindow().getBounds());

		this.setState({
			activeView: 'Login',
			portfolio: null,
		});

		this.stopMarketmaker();
	}

	async stopMarketmaker() {
		await this.api.stop();
		ipc.send('stop-marketmaker');
	}
}

const appContainer = new AppContainer();

// TODO: The "Log Out" button should be disabled when logged out
ipc.on('log-out', () => {
	appContainer.logOut();
});

ipc.on('show-preferences', () => {
	appContainer.setActiveView('Preferences');
});

if (is.development) {
	// Expose setState for debugging in DevTools
	window.setState = appContainer.setState.bind(appContainer);
	window.getState = () => appContainer.state;
	window.config = electron.remote.require('./config');
}

function handleDarkMode() {
	const applyDarkMode = () => {
		const darkMode = config.get('darkMode');
		appContainer.setState({darkMode});
		document.documentElement.classList.toggle('dark-mode', darkMode);
	};

	ipc.on('toggle-dark-mode', () => {
		config.set('darkMode', !config.get('darkMode'));
		applyDarkMode();
	});

	applyDarkMode();
}

handleDarkMode();

export default AppContainer;
export {appContainer};
