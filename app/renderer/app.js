import {ipcRenderer as ipc} from 'electron';
import electronUtil from 'electron-util';
import React from 'react';
import {autoBind} from 'react-extras';
import {Switch} from 'react-router-dom';
import {BrowserRouter as Router, Debug, AuthenticatedRoute, RouteWithProps} from 'react-router-util';
import Api from './api';
import './index.scss';
import Main from './components/main';
import Login from './components/login';

/* eslint-disable */

export default class App extends React.Component {
	constructor() {
		super();
		autoBind(this);

		this.state = {
			isLoggedIn: false
		};
	}

	componentDidMount() {
		// TODO: The "Log Out" button should be disabled when logged out
		ipc.on('log-out', () => {
			ipc.send('stop-marketmaker');

			this.setState({
				isLoggedIn: false,
				portfolio: null
			});
		});

		if (electronUtil.is.development) {
			const state = ipc.sendSync('get-state');
			if (state) {
				state.portfolio.api = new Api({
					endpoint: state.portfolio.api.endpoint,
					seedPhrase: state.portfolio.api.seedPhrase
				})
				this.setState(state);
			}
		}
	}

	setPortfolio(portfolio) {
		const state = {
			isLoggedIn: true,
			portfolio
		};

		this.setState(state);

		if (electronUtil.is.development) {
			state.portfolio.api = {
				endpoint: state.portfolio.api.endpoint,
				seedPhrase: state.portfolio.api.seedPhrase
			};
			ipc.sendSync('set-state', state);
		}
	}

	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<div className="window-draggable-area"></div>

					<AuthenticatedRoute isAuthenticated={this.state.isLoggedIn} redirectFromLoginTo="/dashboard">
						<Switch>
							<RouteWithProps path="/login" component={Login} setPortfolio={this.setPortfolio}/>
							<RouteWithProps component={Main} {...this.state}/>
						</Switch>
					</AuthenticatedRoute>
				</div>
			</Router>
		);
	}
}
