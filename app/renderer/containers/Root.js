import {remote} from 'electron';
import ipc from 'electron-better-ipc';
import {Container} from 'unstated';

const config = remote.require('./config');
// TODO: Uncomment this before we do the public release
/// if (is.development) {
window._config = config;
/// }

class RootContainer extends Container {
	state = {
		activeView: 'Login',
	};

	setActiveView(activeView) {
		this.setState({activeView});
	}
}

const rootContainer = new RootContainer();

function handleDarkMode() {
	const applyDarkMode = () => {
		const darkMode = config.get('darkMode');
		rootContainer.setState({darkMode});
		document.documentElement.classList.toggle('dark-mode', darkMode);
	};

	ipc.on('toggle-dark-mode', () => {
		config.set('darkMode', !config.get('darkMode'));
		applyDarkMode();
	});

	applyDarkMode();
}

handleDarkMode();

export default rootContainer;
