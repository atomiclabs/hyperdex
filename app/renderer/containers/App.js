import electron, {remote, ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import {Container} from 'unstated';

const config = remote.require('./config');

class AppContainer extends Container {
	state = {
		activeView: 'Login',
	};

	setActiveView(activeView) {
		this.setState({activeView});
	}

	logIn({portfolio, currencies, api}) {
		this.api = api;

		this.setState({
			activeView: 'Dashboard',
			portfolio,
			currencies,
		});
	}

	logOut() {
		this.setState({
			activeView: 'Login',
			portfolio: null,
		});

		this.stopMarketmaker();
		config.set('windowState', remote.getCurrentWindow().getBounds());
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
