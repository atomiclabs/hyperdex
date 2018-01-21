import {ipcRenderer as ipc} from 'electron';
import React from 'react';
import {autoBind} from 'react-extras';
import {Switch} from 'react-router-dom';
import {BrowserRouter as Router, Debug, AuthenticatedRoute, RouteWithProps} from 'react-router-util';
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
			this.stopMarketmaker();

			this.setState({
				isLoggedIn: false,
				portfolio: null
			});
		});
	}

	async stopMarketmaker() {
		await this.state.portfolio.api.stop();
		ipc.send('stop-marketmaker');
	}

	setPortfolio(portfolio) {
		this.setState({
			isLoggedIn: true,
			portfolio
		});
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
