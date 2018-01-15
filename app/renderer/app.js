import electron from 'electron';
import $ from 'jquery';
import React from 'react';
import {Route, Redirect, NavLink} from 'react-router-dom';
import {history, BrowserRouter as Router, Debug} from 'react-router-util';
import 'popper.js/dist/umd/popper';
import 'bootstrap/util';
import 'bootstrap/tooltip';
import Preferences from './components/preferences';
import './index.scss';

/* eslint-disable */

// TODO: All these components will be moved into separate files when we actually have something for them. Keeping them here for now for simplicity and to reduce churn.

const Login = () => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h3 className="dashhead-title">Login</h3>
			</div>
		</header>
		<main>
			<p>TODO: Login form</p>
		</main>
	</div>
);

const Dashboard = () => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h6 className="dashhead-subtitle">Luke's portfolio</h6>
				<h3 className="dashhead-title">Dashboard</h3>
			</div>
		</header>
		<main>
			<p>Content</p>
		</main>
	</div>
);

const Swap = () => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h3 className="dashhead-title">Swap</h3>
			</div>
		</header>
		<main>
			<p>Content</p>
		</main>
	</div>
);

const Exchange = () => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h3 className="dashhead-title">Exchange</h3>
			</div>
		</header>
		<main>
			<p>Content</p>
		</main>
	</div>
);

const Trades = () => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h3 className="dashhead-title">Trades</h3>
			</div>
		</header>
		<main>
			<p>Content</p>
		</main>
	</div>
);

const Funds = () => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h3 className="dashhead-title">Funds</h3>
			</div>
		</header>
		<main>
			<p>Content</p>
		</main>
	</div>
);

const IconNavItem = props => (
	<li className="nav-item">
		<NavLink to={props.to} className="nav-link" title={props.title} data-toggle="tooltip" data-placement="right">
			<span className={`icon icon-${props.icon}`}></span>
			<small className="iconav-nav-label d-md-none">{props.title}</small>
		</NavLink>
	</li>
);

const Nav = () => (
	<nav className="iconav">
		<div className="iconav-slider">
			<ul className="nav nav-pills iconav-nav flex-md-column">
				<IconNavItem title="Dashboard" icon="home" to="/dashboard"/>
				<IconNavItem title="Swap" icon="cycle" to="/swap"/>
				<IconNavItem title="Exchange" icon="area-graph" to="/exchange"/>
				<IconNavItem title="Trades" icon="list" to="/trades"/>
				<IconNavItem title="Funds" icon="credit" to="/funds"/>
				<IconNavItem title="Preferences" icon="cog" to="/preferences"/>
			</ul>
		</div>
	</nav>
);

// TODO: This will be used when we implement a login page
const isLoggedIn = true;

export default class App extends React.Component {
	componentDidMount() {
		$('[data-toggle="tooltip"]')
			.on('click', () => {
				// Remove stuck tooltips
				// Probably caused by React somehow
				$('.tooltip').remove();
			})
			.tooltip();
	}

	render() {
		return (
			<Router>
				<div>
					<Debug/>

					<div className="with-iconav">
						<Nav/>

						<div className="container">
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
				</div>
			</Router>
		);
	}
}

electron.ipcRenderer.on('show-preferences', () => {
	history.push('/preferences');
});
