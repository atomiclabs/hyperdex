import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {BrowserRouter as Router, Debug} from 'react-router-util';
import './index.scss';
import Main from './components/main';
import Login from './components/login';

/* eslint-disable */

// TODO: This will be used when we implement a login page
const isLoggedIn = true;

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<Route exact path="/" render={() => (
						isLoggedIn ? (
							<Redirect to="/main"/>
						) : (
							<Redirect to="/login"/>
						)
					)}/>

					<Route path="/main" render={props => <Main {...props} portfolio={{ name: 'Luke\'s Portfolio' }} />} />
					<Route path="/login" render={props => <Login {...props} />} />
				</div>
			</Router>
		);
	}
}
