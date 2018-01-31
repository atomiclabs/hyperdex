import {ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import React from 'react';
import {hot} from 'react-hot-loader';
import './styles/index.scss';
import View from './components/view';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Swap from './components/swap';
import Exchange from './components/exchange';
import Trades from './components/trades';
import Funds from './components/funds';
import Preferences from './components/preferences';

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

		return (
			<React.Fragment>
				<div className="window-draggable-area"/>

				<View isActive={activeView === 'login'} component={Login} setAppState={this.setAppState}/>

				<View isActive={activeView === 'dashboard'} component={Dashboard} setAppState={this.setAppState} {...this.state}/>
				<View isActive={activeView === 'swap'} component={Swap} setAppState={this.setAppState} {...this.state}/>
				<View isActive={activeView === 'exchange'} component={Exchange} setAppState={this.setAppState} {...this.state}/>
				<View isActive={activeView === 'trades'} component={Trades} setAppState={this.setAppState} {...this.state}/>
				<View isActive={activeView === 'funds'} component={Funds} setAppState={this.setAppState} {...this.state}/>
				<View isActive={activeView === 'preferences'} component={Preferences} setAppState={this.setAppState} {...this.state}/>
			</React.Fragment>
		);
	}
}

export default hot(module)(App);
