import electron, {remote, ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import _ from 'lodash';
import Cycled from 'cycled';
import {appViews} from '../../constants';
import fireEvery from '../fire-every';
import Container from './Container';

const config = remote.require('./config');

class AppContainer extends Container {
	state = {
		activeView: 'Login',
	};

	constructor() {
		super();
		this.views = new Cycled(appViews);
	}

	setActiveView(activeView) {
		this.setState({activeView});
		this.views.index = this.views.indexOf(activeView);
	}

	setNextView() {
		this.setActiveView(this.views.next());
	}

	setPreviousView() {
		this.setActiveView(this.views.previous());
	}

	logIn(portfolio) {
		this.setState({
			activeView: 'Dashboard',
			portfolio,
		});
	}

	// TODO: We should use the portfolio socket event instead once it's implemented
	async watchCurrencies() {
		if (!this.stopWatchingCurrencies) {
			this.stopWatchingCurrencies = await fireEvery(async () => {
				const {portfolio: currencies} = await this.api.portfolio();
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

ipc.on('set-active-view', (event, view) => {
	appContainer.setActiveView(view);
});

ipc.on('set-next-view', () => {
	appContainer.setNextView();
});

ipc.on('set-previous-view', () => {
	appContainer.setPreviousView();
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

export default appContainer;
