import electron from 'electron';
import $ from 'jquery';
import React from 'react';
import {Route, NavLink} from 'react-router-dom';
import {history} from 'react-router-util';
import 'popper.js/dist/umd/popper';
import 'bootstrap/util';
import 'bootstrap/tooltip';
import TabView from './tab-view';
import Dashboard from './dashboard';
import Preferences from './preferences';
import Funds from './funds';

/* eslint-disable */

// TODO: All these components will be moved into separate files when we actually have something for them. Keeping them here for now for simplicity and to reduce churn.

const Swap = props => (
	<TabView {...props} title="Swap">
			<p>Content</p>
	</TabView>
);

const Exchange = props => (
	<TabView {...props} title="Exchange">
			<p>Content</p>
	</TabView>
);

const Trades = props => (
	<TabView {...props} title="Trades">
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

export default class Main extends React.Component {
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
			<div className="Main">
				<div className="with-iconav">
					<Nav/>

					<div className="container">
						<Route path="/dashboard" render={() => <Dashboard {...this.props} />} />
						<Route path="/swap" render={() => <Swap {...this.props} />} />
						<Route path="/exchange" render={() => <Exchange {...this.props} />} />
						<Route path="/trades" render={() => <Trades {...this.props} />} />
						<Route path="/funds" render={() => <Funds {...this.props} />} />
						<Route path="/preferences" render={() => <Preferences {...this.props} />} />
					</div>
				</div>
			</div>
		);
	}
}

electron.ipcRenderer.on('show-preferences', () => {
	history.push('/preferences');
});
