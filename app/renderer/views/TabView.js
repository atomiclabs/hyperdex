import {remote} from 'electron';
import React from 'react';
import {appContainer} from 'containers/App';
import avatar from '../avatar';
import Nav from './Nav';
import './TabView.scss';

const {openGitHubIssue} = remote.require('./util');

const TabView = props => (
	<div className="TabView">
		<header className="toolbar">
			<h1 className="app-name">
				HyperDEX
			</h1>
			<div className="right-container">
				<button
					type="button"
					className="feedback-button"
					onClick={() => {
						openGitHubIssue('<!--\n\nWe appreciate your feedback!\nTry to include as much relevant info as possible.\n\n-->');
					}}
				>
					Feedback
				</button>
				<div className="portfolio-dropdown">
					<div className="avatar-wrapper">
						<img src={avatar(appContainer.state.portfolio.name)}/>
					</div>
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
