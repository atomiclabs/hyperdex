import React from 'react';
import globalState from '../global-state';

const IconNavItem = props => {
	const setView = () => globalState.set({activeView: props.to});
	const active = globalState.get().activeView === props.to;

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

const Nav = props => (
	<nav className="iconav">
		<div className="iconav-slider">
			<ul className="nav nav-pills iconav-nav flex-md-column">
				<IconNavItem to="Dashboard" title="Dashboard" icon="home" {...props}/>
				<IconNavItem to="Swap" title="Swap" icon="cycle" {...props}/>
				<IconNavItem to="Exchange" title="Exchange" icon="area-graph" {...props}/>
				<IconNavItem to="Trades" title="Trades" icon="list" {...props}/>
				<IconNavItem to="Funds" title="Funds" icon="credit" {...props}/>
				<IconNavItem to="Preferences" title="Preferences" icon="cog" {...props}/>
			</ul>
		</div>
	</nav>
);

export default Nav;
