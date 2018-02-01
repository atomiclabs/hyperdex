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
		activeView: 'Login',
		portfolio: null,
	};

	componentDidMount() {
		// TODO: The "Log Out" button should be disabled when logged out
		ipc.on('log-out', () => {
			this.stopMarketmaker();

			this.setState({
				activeView: 'Login',
				portfolio: null,
			});
		});

		ipc.on('show-preferences', () => {
			this.setState({activeView: 'Preferences'});
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
			</React.Fragment>
		);
	}
}

export default hot(module)(App);
