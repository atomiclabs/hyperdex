import {ipcRenderer as ipc} from 'electron';
import React from 'react';
import {Switch} from 'react-router-dom';
import {BrowserRouter as Router, Debug, AuthenticatedRoute, RouteWithProps} from 'react-router-util';
import './index.scss';
import Main from './components/main';
import Login from './components/login';

/* eslint-disable */

export default class App extends React.Component {
	constructor() {
		super();

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

					<Switch>
						<RouteWithProps path="/login" component={Login} setPortfolio={this.setPortfolio.bind(this)}/>
						<AuthenticatedRoute isAuthenticated={this.state.isLoggedIn} component={Main} {...this.state}/>
					</Switch>
				</div>
			</Router>
		);
	}
}
