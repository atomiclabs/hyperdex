import electron from 'electron';
import $ from 'jquery';
import React from 'react';
import {Route, Redirect, NavLink} from 'react-router-dom';
import {history} from 'react-router-util';
import 'popper.js/dist/umd/popper';
import 'bootstrap/util';
import 'bootstrap/tooltip';
import Preferences from './preferences';
import TabView from './tab-view';

/* eslint-disable */

// TODO: All these components will be moved into separate files when we actually have something for them. Keeping them here for now for simplicity and to reduce churn.

const Dashboard = props => (
	<TabView {...props} title="Dashboard">
			<p>Content</p>
	</TabView>
);

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

const Funds = props => (
	<TabView {...props} title="Funds">
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

const Nav = ({match}) => (
	<nav className="iconav">
		<div className="iconav-slider">
			<ul className="nav nav-pills iconav-nav flex-md-column">
				<IconNavItem title="Dashboard" icon="home" to={match.url + '/dashboard'}/>
				<IconNavItem title="Swap" icon="cycle" to={match.url + '/swap'}/>
				<IconNavItem title="Exchange" icon="area-graph" to={match.url + '/exchange'}/>
				<IconNavItem title="Trades" icon="list" to={match.url + '/trades'}/>
				<IconNavItem title="Funds" icon="credit" to={match.url + '/funds'}/>
				<IconNavItem title="Preferences" icon="cog" to={match.url + '/preferences'}/>
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
		const {portfolio, match} = this.props;

		return (
			<div className="Main">
				<div className="with-iconav">
					<Nav {...this.props}/>
					<div className="container">
						<Route exact path={match.url} render={() => <Redirect to={match.url + '/dashboard'}/>}/>
						<Route path={match.url + '/dashboard'} render={() => <Dashboard {...this.props} />} />
						<Route path={match.url + '/swap'} render={() => <Swap {...this.props} />} />
						<Route path={match.url + '/exchange'} render={() => <Exchange {...this.props} />} />
						<Route path={match.url + '/trades'} render={() => <Trades {...this.props} />} />
						<Route path={match.url + '/funds'} render={() => <Funds {...this.props} />} />
						<Route path={match.url + '/preferences'} render={() => <Preferences {...this.props} />} />
					</div>
				</div>
			</div>
		);
	}
}

electron.ipcRenderer.on('show-preferences', () => {
	history.push('/main/preferences');
});
