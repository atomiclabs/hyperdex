import {ipcRenderer as ipc} from 'electron';
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {BrowserRouter as Router, Debug, AuthenticatedRoute} from 'react-router-util';
import './index.scss';
import Main from './components/main';
import Login from './components/login';

/* eslint-disable */

// TODO: This will be used when we implement a login page
const isLoggedIn = false;

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			portfolios: [],
		};

		ipc.send('get-portfolios');
		ipc.on('portfolios', (event, portfolios) => {
			this.setState({portfolios});
		});
	}
	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<div className="window-draggable-area"></div>

					<Switch>
						<AuthenticatedRoute path="/" exact isAuthenticated={isLoggedIn} redirectTo="/dashboard"/>
						<Route path="/login" render={() => <Login {...this.state} />}/>
						<Route render={() => <Main {...this.state} portfolio={{ name: 'Luke\'s Portfolio' }} />}/>
					</Switch>
				</div>
			</Router>
		);
	}
}
