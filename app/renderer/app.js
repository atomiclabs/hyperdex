import {ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import React from 'react';
import {hot} from 'react-hot-loader';
import './styles/index.scss';
import View from './components/view';
import Login from './views/login';
import Dashboard from './views/dashboard';
import Swap from './views/swap';
import Exchange from './views/exchange';
import Trades from './views/trades';
import Funds from './views/funds';
import Preferences from './views/preferences';

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
		const {activeView} = this.state;
		const is = view => view === activeView;

		return (
			<React.Fragment>
				<div className="window-draggable-area"/>

				<View isActive={is('login')} component={Login} setAppState={this.setAppState}/>
				<View isActive={is('dashboard')} component={Dashboard} setAppState={this.setAppState} {...this.state}/>
				<View isActive={is('swap')} component={Swap} setAppState={this.setAppState} {...this.state}/>
				<View isActive={is('exchange')} component={Exchange} setAppState={this.setAppState} {...this.state}/>
				<View isActive={is('trades')} component={Trades} setAppState={this.setAppState} {...this.state}/>
				<View isActive={is('funds')} component={Funds} setAppState={this.setAppState} {...this.state}/>
				<View isActive={is('preferences')} component={Preferences} setAppState={this.setAppState} {...this.state}/>
			</React.Fragment>
		);
	}
}

export default hot(module)(App);
