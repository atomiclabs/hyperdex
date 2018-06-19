import React from 'react';
import Button from 'components/Button';
import Avatar from 'components/Avatar';
import Nav from './Nav';
import './TabView.scss';

const {is, activeWindow} = global.mainModules.electronUtil;
const {openGitHubIssue} = global.mainModules.util;

class TabView extends React.Component {
	componentDidMount() {
		activeWindow().setSheetOffset(document.querySelector('.toolbar').getBoundingClientRect().height);
	}

	render() {
		const {props} = this;

		return (
			<div className="TabView">
				<header className="toolbar">
					<h1 className="app-name">
						{is.macos ? 'HyperDEX' : ''}
					</h1>
					<div className="right-container">
						<Button
							className="feedback-button"
							value="Feedback"
							onClick={() => {
								openGitHubIssue('<!--\n\nWe appreciate your feedback!\nTry to include as much relevant info as possible.\n\n-->');
							}}
						/>
						<div className="portfolio-dropdown">
							<div className="avatar-wrapper">
								<Avatar/>
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
	}
}

export default TabView;
