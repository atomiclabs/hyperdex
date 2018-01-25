import {ipcRenderer as ipc} from 'electron';
import electronUtil from 'electron-util';
import React from 'react';
import {autoBind} from 'react-extras';
import {Switch} from 'react-router-dom';
import {BrowserRouter as Router, Debug, AuthenticatedRoute, RouteWithProps} from 'react-router-util';
import './styles/index.scss';
import Api from './api';
import Main from './components/main';
import Login from './components/login';
import Welcome from './components/welcome';

/* eslint-disable */

export default class App extends React.Component {
	constructor() {
		super();
		autoBind(this);

		this.state = {
			portfolio: null
		};
	}

	componentWillMount() {
		if (electronUtil.is.development) {
			const state = ipc.sendSync('get-state');
			if (state) {
				state.api = new Api(state.api)
				this.setState(state);

				window.api = state.portfolio.api;
			}
		}
	}

	componentDidMount() {
		// TODO: The "Log Out" button should be disabled when logged out
		ipc.on('log-out', () => {
			this.stopMarketmaker();

			this.setState({
				portfolio: null
			});
		});
	}

	async stopMarketmaker() {
		await this.state.api.stop();
		ipc.send('stop-marketmaker');
	}

	setAppState(state) {
		this.setState(state);

		if (electronUtil.is.development) {
			// Expose the API for debugging in DevTools
			// Example: `api.debug({method: 'portfolio'})`
			window.api = state.api;

			ipc.sendSync('set-state', state);
		}
	}

	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<div className="window-draggable-area"></div>

					<AuthenticatedRoute isAuthenticated={!!this.state.portfolio} redirectFromLoginTo="/dashboard">
						<Switch>
							<RouteWithProps path="/login" exact component={Login} setAppState={this.setAppState}/>
							<RouteWithProps path="/login/welcome" exact component={Welcome} setAppState={this.setAppState}/>
							<RouteWithProps component={Main} {...this.state}/>
						</Switch>
					</AuthenticatedRoute>
				</div>
			</Router>
		);
	}
}
