import electron from 'electron';
import React from 'react';
import _ from 'lodash';
import {Subscribe} from 'unstated';
import {Trans} from 'react-i18next';
import appContainer from 'containers/App';
import Link from 'components/Link';
import Button from 'components/Button';
import {instance, translate} from '../translate';
import TabView from './TabView';
import CurrencySetting from './Settings/Currency';
import ThemeSetting from './Settings/Theme';
import './Settings.scss';

const config = electron.remote.require('./config');
const {deletePortfolio} = electron.remote.require('./portfolio-util');
const t = translate('settings');

const persistState = _.debounce((name, value) => config.set(name, value), 500);

class Settings extends React.Component {
	state = {};

	handleChange = (value, event) => {
		const {name} = event.target;
		this.setState({[name]: value});
		persistState(name, value);
	};

	handleLogOutLinkClick = () => {
		appContainer.logOut({
			activeView: 'AppSettings',
		});
	};

	handleDeletePortfolioClick = () => {
		deletePortfolio(appContainer.state.portfolio.id);
		appContainer.logOut();
	}

	render() {
		return (
			<Subscribe to={[appContainer]}>
				{() => (
					<TabView title="Settings" className="Settings">
						<header>
							<h2>{t('title')}</h2>
						</header>
						<main>
							<div className="section">
								<h3>{t('portfolio')}</h3>
								<CurrencySetting/>
								<div className="form-group">
									<Button value={t('deletePortfolio')} color="red" onClick={this.handleDeletePortfolioClick}/>
								</div>
							</div>
							<div className="section">
								<h3>{t('app')}</h3>
								<ThemeSetting/>
								<Trans i18n={instance} i18nKey="logOutAppSettings" t={t}>
									<p><Link onClick={this.handleLogOutLinkClick}>Log out</Link> to see more app settings.</p>
								</Trans>
							</div>
						</main>
					</TabView>
				)}
			</Subscribe>
		);
	}
}

export default Settings;
