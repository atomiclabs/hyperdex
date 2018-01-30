import electron from 'electron';
import $ from 'jquery';
import React from 'react';
import {NavLink} from 'react-router-dom';
import {history, RouteWithProps} from 'react-router-util';
import 'popper.js/dist/umd/popper';
import 'bootstrap/util';
import 'bootstrap/tooltip';
import Dashboard from './dashboard';
import Swap from './swap';
import Exchange from './exchange';
import Trades from './trades';
import Funds from './funds';
import Preferences from './preferences';

const IconNavItem = props => (
	<li className="nav-item">
		<NavLink to={props.to} className="nav-link" title={props.title} data-toggle="tooltip" data-placement="right">
			<span className={`icon icon-${props.icon}`}/>
			<small className="iconav-nav-label d-md-none">
				{props.title}
			</small>
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

class Main extends React.Component {
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
						<RouteWithProps path="/dashboard" component={Dashboard} {...this.props}/>
						<RouteWithProps path="/swap" component={Swap} {...this.props}/>
						<RouteWithProps path="/exchange" component={Exchange} {...this.props}/>
						<RouteWithProps path="/trades" component={Trades} {...this.props}/>
						<RouteWithProps path="/funds" component={Funds} {...this.props}/>
						<RouteWithProps path="/preferences" component={Preferences} {...this.props}/>
					</div>
				</div>
			</div>
		);
	}
}

electron.ipcRenderer.on('show-preferences', () => {
	history.push('/preferences');
});

export default Main;
