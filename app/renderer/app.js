import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect
} from 'react-router-dom';
import Navigator from './components/navigator';

/* eslint-disable */

// TODO: All these components will be moved into separate files when we actually have something for them. Keeping them here for now for simplicity and to reduce churn.

const Login = () => (
	<div>
		<h1>
			Login
		</h1>
	</div>
);

const Dashboard = () => (
	<div>
		<h1>
			Dashboard
		</h1>
	</div>
);

const Swap = () => (
	<div>
		<h1>
			Swap
		</h1>
	</div>
);

const Exchange = () => (
	<div>
		<h1>
			Exchange
		</h1>
	</div>
);

const Trades = () => (
	<div>
		<h1>
			Trades
		</h1>
	</div>
);

const Funds = () => (
	<div>
		<h1>
			Funds
		</h1>
	</div>
);

const Preferences = () => (
	<div>
		<h1>
			Preferences
		</h1>
	</div>
);

// TODO: This will be used when we implement a login page
const isLoggedIn = true;

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<div style={{ display: 'flex', height: '100%' }}>
					<Navigator/>

					<nav style={{
						flex: 0,
						padding: '10px',
						width: '120px',
						background: '#f0f0f0'
					}}>
						<ul>
							<li><Link to="/dashboard">Dashboard</Link></li>
							<li><Link to="/swap">Swap</Link></li>
							<li><Link to="/exchange">Exchange</Link></li>
							<li><Link to="/trades">Trades</Link></li>
							<li><Link to="/funds">Funds</Link></li>
							<li><Link to="/preferences">Preferences</Link></li>
						</ul>
					</nav>

					<div style={{ flex: 1, padding: '10px' }}>
						<Route exact path="/" render={() => (
							isLoggedIn ? (
								<Redirect to="/dashboard"/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route path="/login" component={Login}/>
						<Route path="/dashboard" component={Dashboard}/>
						<Route path="/swap" component={Swap}/>
						<Route path="/exchange" component={Exchange}/>
						<Route path="/trades" component={Trades}/>
						<Route path="/funds" component={Funds}/>
						<Route path="/preferences" component={Preferences}/>
					</div>
				</div>
			</Router>
		);
	}
}
