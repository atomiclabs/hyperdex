import React from 'react';
import {appContainer} from 'containers/App';
import avatar from '../avatar';
import Nav from './Nav';
import './TabView.scss';

const TabView = props => (
	<div className="TabView">
		<header className="toolbar">
			<h1 className="app-name">
				HyperDEX
			</h1>
			<div className="portfolio-dropdown">
				<div className="avatar-wrapper">
					<img src={avatar(appContainer.state.portfolio.name)}/>
				</div>
			</div>
		</header>
		<Nav/>
		<main className="content">
			<div className={props.className}>
				{props.children}
			</div>
		</main>
	</div>
);

export default TabView;
