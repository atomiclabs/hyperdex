import {remote} from 'electron';
import {is, activeWindow} from 'electron-util';
import React from 'react';
import Button from 'components/Button';
import Avatar from 'components/Avatar';
import DonateButton from 'components/DonateButton';
import {translate} from '../translate';
import Nav from './Nav';
import './TabView.scss';

const {openGitHubIssue} = remote.require('./util');
const t = translate('common');

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
							value={t('feedback')}
							onClick={() => {
								openGitHubIssue('<!--\n\nWe appreciate your feedback!\nTry to include as much relevant info as possible.\n\nSecurity issues should be reported to hyperdex@protonmail.com, **not** on GitHub.\n\n-->');
							}}
						/>
						<DonateButton/>
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
