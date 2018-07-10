import React from 'react';
import appContainer from 'containers/App';
import {translate} from '../translate';

const t = translate('nav');

const IconNavItem = props => {
	const setView = () => appContainer.setActiveView(props.to);
	const active = appContainer.state.activeView === props.to;
	const title = props.to.toLowerCase();

	return (
		<div onClick={setView} className={`nav--button ${active ? 'active' : ''}`}>
			<span className={`icon icon--${title}`}/>
			<span className="title">
				{t(title)}
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
