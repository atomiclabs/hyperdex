import React from 'react';
import {appContainer} from '../containers/App';

const IconNavItem = props => {
	const setView = () => appContainer.setActiveView(props.to);
	const active = appContainer.state.activeView === props.to;

	return (
		<li className="nav-item">
			<a onClick={setView} className={`nav-link ${active && 'active'}`}>
				<span className={`icon icon-${props.icon}`}/>
				<small className="iconav-nav-label d-md-none">
					{props.title}
				</small>
			</a>
		</li>
	);
};

const Nav = () => (
	<nav className="iconav">
		<div className="iconav-slider">
			<ul className="nav nav-pills iconav-nav flex-md-column">
				<IconNavItem to="Dashboard" title="Dashboard" icon="home"/>
				<IconNavItem to="Swap" title="Swap" icon="cycle"/>
				<IconNavItem to="Exchange" title="Exchange" icon="area-graph"/>
				<IconNavItem to="Trades" title="Trades" icon="list"/>
				<IconNavItem to="Funds" title="Funds" icon="credit"/>
				<IconNavItem to="Preferences" title="Preferences" icon="cog"/>
			</ul>
		</div>
	</nav>
);

export default Nav;
