import React from 'react';
import PropTypes from 'prop-types';
import appContainer from 'containers/App';
import DashboardIcon from 'icons/Dashboard';
/// import SwapIcon from 'icons/Swap';
import ExchangeIcon from 'icons/Exchange';
import TradesIcon from 'icons/Trades';
import SettingsIcon from 'icons/Settings';
import {translate} from '../translate';

const t = translate('nav');

const IconNavItem = ({icon: Icon, ...props}) => {
	const setView = () => appContainer.setActiveView(props.to);
	const active = appContainer.state.activeView === props.to;
	const title = props.to.toLowerCase();

	return (
		<div onClick={setView} className={`nav--button ${active ? 'active' : ''}`}>
			<Icon className="icon"/>
			<span className="title">
				{t(title)}
			</span>
		</div>
	);
};

IconNavItem.propTypes = {
	icon: PropTypes.func.isRequired,
	to: PropTypes.string.isRequired,
};

const Nav = () => (
	<nav className="nav">
		<IconNavItem to="Dashboard" icon={DashboardIcon}/>
		{/* <IconNavItem to="Swap" icon={SwapIcon}/> */}
		<IconNavItem to="Exchange" icon={ExchangeIcon}/>
		<IconNavItem to="Trades" icon={TradesIcon}/>
		<IconNavItem to="Settings" icon={SettingsIcon}/>
	</nav>
);

export default Nav;
