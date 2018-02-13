import electron, {remote, ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import React from 'react';
import {hot} from 'react-hot-loader';
import './styles/index.scss';
import View from './components/View';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Swap from './views/Swap';
import Exchange from './views/Exchange';
import Trades from './views/Trades';
import Funds from './views/Funds';
import Preferences from './views/Preferences';
import ComponentsPreview from './views/ComponentsPreview';

const config = remote.require('./config');

class App extends React.Component {
	setAppState = state => {
		if (is.development) {
			console.log('State:', state);
		}

		this.setState(state);
	}

	state = {
		activeView: 'Login',
		portfolio: null,
	};

	componentDidMount() {
		this.handleDarkMode();

		// TODO: The "Log Out" button should be disabled when logged out
		ipc.on('log-out', () => {
			this.stopMarketmaker();

			config.set('windowState', remote.getCurrentWindow().getBounds());

			this.setState({
				activeView: 'Login',
				portfolio: null,
			});
		});

		ipc.on('show-preferences', () => {
			this.setState({activeView: 'Preferences'});
		});

		if (is.development) {
			// Expose setState for debugging in DevTools
			window.setState = this.setState.bind(this);
			window.getState = () => this.state;
			window.config = electron.remote.require('./config');
		}
	}

	handleDarkMode() {
		const applyDarkMode = () => {
			const darkMode = config.get('darkMode');
			this.setState({darkMode});
			document.documentElement.classList.toggle('dark-mode', darkMode);
		};

		ipc.on('toggle-dark-mode', () => {
			config.set('darkMode', !config.get('darkMode'));
			applyDarkMode();
		});

		applyDarkMode();
	}

	async stopMarketmaker() {
		await this.state.api.stop();
		ipc.send('stop-marketmaker');
	}

	render() {
		const sharedProps = {
			...this.state,
			setAppState: this.setAppState,
		};

		return (
			<React.Fragment>
				<div className="window-draggable-area"/>

				<View {...sharedProps} component={Login}/>
				<View {...sharedProps} component={Dashboard}/>
				<View {...sharedProps} component={Swap}/>
				<View {...sharedProps} component={Exchange}/>
				<View {...sharedProps} component={Trades}/>
				<View {...sharedProps} component={Funds}/>
				<View {...sharedProps} component={Preferences}/>
				<View {...sharedProps} component={ComponentsPreview}/>
			</React.Fragment>
		);
	}
}

export default hot(module)(App);
