import React from 'react';
import appContainer from 'containers/App';

const IconNavItem = props => {
	const setView = () => appContainer.setActiveView(props.to);
	const active = appContainer.state.activeView === props.to;

	return (
		<div onClick={setView} className={`nav--button ${active ? 'active' : ''}`}>
			<span className={`icon icon--${props.to.toLowerCase()}`}/>
			<span className="title">
				{props.to}
			</span>
		</div>
	);
};

const Nav = () => (
	<nav className="nav">
		<IconNavItem to="Dashboard"/>
		<IconNavItem to="Swap"/>
		<IconNavItem to="Exchange"/>
		<IconNavItem to="Trades"/>
		<IconNavItem to="Settings"/>
	</nav>
);

export default Nav;
