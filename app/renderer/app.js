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
	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<div className="window-draggable-area"></div>

					<Switch>
						<AuthenticatedRoute path="/" exact isAuthenticated={isLoggedIn} redirectTo="/dashboard"/>
						<Route path="/login" component={Login}/>
						<Route render={() => <Main portfolio={{ name: 'Luke\'s Portfolio' }} />}/>
					</Switch>
				</div>
			</Router>
		);
	}
}
