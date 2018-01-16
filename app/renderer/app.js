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
import TabView from './components/tab-view';

/* eslint-disable */

// TODO: All these components will be moved into separate files when we actually have something for them. Keeping them here for now for simplicity and to reduce churn.

const Login = props => (
	<TabView title="Login" subtitle={props.portfolio.name}>
			<p>TODO: Login form</p>
	</TabView>
);

const Dashboard = props => (
	<TabView title="Dashboard" subtitle={props.portfolio.name}>
			<p>Content</p>
	</TabView>
);

const Swap = props => (
	<TabView title="Swap" subtitle={props.portfolio.name}>
			<p>Content</p>
	</TabView>
);

const Exchange = props => (
	<TabView title="Exchange" subtitle={props.portfolio.name}>
			<p>Content</p>
	</TabView>
);

const Trades = props => (
	<TabView title="Trades" subtitle={props.portfolio.name}>
			<p>Content</p>
	</TabView>
);

const Funds = props => (
	<TabView title="Funds" subtitle={props.portfolio.name}>
			<p>Content</p>
	</TabView>
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

							<Route path="/login" render={() => <Login portfolio={{ name: 'Luke\'s Portfolio' }} />} />
							<Route path="/dashboard" render={() => <Dashboard portfolio={{ name: 'Luke\'s Portfolio' }} />} />
							<Route path="/swap" render={() => <Swap portfolio={{ name: 'Luke\'s Portfolio' }} />} />
							<Route path="/exchange" render={() => <Exchange portfolio={{ name: 'Luke\'s Portfolio' }} />} />
							<Route path="/trades" render={() => <Trades portfolio={{ name: 'Luke\'s Portfolio' }} />} />
							<Route path="/funds" render={() => <Funds portfolio={{ name: 'Luke\'s Portfolio' }} />} />
							<Route path="/preferences" render={() => <Preferences portfolio={{ name: 'Luke\'s Portfolio' }} />} />
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
