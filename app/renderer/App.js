import {ipcRenderer as ipc} from 'electron';
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

class App extends React.Component {
	setAppState = state => {
		if (is.development) {
			console.log('State:', state);
		}

		this.setState(state);
	}

	state = {
		activeView: 'login',
		portfolio: null,
	};

	componentDidMount() {
		// TODO: The "Log Out" button should be disabled when logged out
		ipc.on('log-out', () => {
			this.stopMarketmaker();

			this.setState({
				activeView: 'login',
				portfolio: null,
			});
		});

		ipc.on('show-preferences', () => {
			this.setState({activeView: 'preferences'});
		});

		if (is.development) {
			// Expose the API and setState for debugging in DevTools
			// Example: `api.debug({method: 'portfolio'})`
			window.api = this.state.api;
			window.setState = this.setState.bind(this);
		}
	}

	async stopMarketmaker() {
		await this.state.api.stop();
		ipc.send('stop-marketmaker');
	}

	render() {
		const is = view => view === this.state.activeView;
		const sharedProps = {
			...this.state,
			setAppState: this.setAppState,
		};

		return (
			<React.Fragment>
				<div className="window-draggable-area"/>

				<View isActive={is('login')} component={Login} {...sharedProps}/>
				<View isActive={is('dashboard')} component={Dashboard} {...sharedProps}/>
				<View isActive={is('swap')} component={Swap} {...sharedProps}/>
				<View isActive={is('exchange')} component={Exchange} {...sharedProps}/>
				<View isActive={is('trades')} component={Trades} {...sharedProps}/>
				<View isActive={is('funds')} component={Funds} {...sharedProps}/>
				<View isActive={is('preferences')} component={Preferences} {...sharedProps}/>
			</React.Fragment>
		);
	}
}

export default hot(module)(App);
