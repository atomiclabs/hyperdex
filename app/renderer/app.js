import {ipcRenderer as ipc} from 'electron';
import React from 'react';
import {hot} from 'react-hot-loader';
import {Switch} from 'react-router-dom';
import {BrowserRouter as Router, Debug, AuthenticatedRoute, RouteWithProps} from 'react-router-util';
import './styles/index.scss';
import Main from './components/main';
import Login from './components/login';
import Welcome from './components/welcome';

class App extends React.Component {
	setAppState = state => {
		this.setState(state);
	}

	state = {
		portfolio: null,
	};

	componentDidMount() {
		// TODO: The "Log Out" button should be disabled when logged out
		ipc.on('log-out', () => {
			this.stopMarketmaker();

			this.setState({
				portfolio: null,
			});
		});
	}

	async stopMarketmaker() {
		await this.state.api.stop();
		ipc.send('stop-marketmaker');
	}

	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<div className="window-draggable-area"/>

					<AuthenticatedRoute isAuthenticated={Boolean(this.state.portfolio)} redirectFromLoginTo="/dashboard">
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

export default hot(module)(App);
