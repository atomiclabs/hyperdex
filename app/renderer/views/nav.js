import React from 'react';

const IconNavItem = props => {
	const setView = () => props.setAppState({activeView: props.to});
	const active = props.activeView === props.to;

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
				<IconNavItem to="dashboard" title="Dashboard" icon="home" {...props}/>
				<IconNavItem to="swap" title="Swap" icon="cycle" {...props}/>
				<IconNavItem to="exchange" title="Exchange" icon="area-graph" {...props}/>
				<IconNavItem to="trades" title="Trades" icon="list" {...props}/>
				<IconNavItem to="funds" title="Funds" icon="credit" {...props}/>
				<IconNavItem to="preferences" title="Preferences" icon="cog" {...props}/>
			</ul>
		</div>
	</nav>
);

export default Nav;
