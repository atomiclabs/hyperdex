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
				<IconNavItem {...props} to="Dashboard" title="Dashboard" icon="home"/>
				<IconNavItem {...props} to="Swap" title="Swap" icon="cycle"/>
				<IconNavItem {...props} to="Exchange" title="Exchange" icon="area-graph"/>
				<IconNavItem {...props} to="Trades" title="Trades" icon="list"/>
				<IconNavItem {...props} to="Funds" title="Funds" icon="credit"/>
				<IconNavItem {...props} to="Preferences" title="Preferences" icon="cog"/>
			</ul>
		</div>
	</nav>
);

export default Nav;
