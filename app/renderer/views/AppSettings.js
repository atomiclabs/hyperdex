import {remote} from 'electron';
import React from 'react';
import _ from 'lodash';
import appContainer from 'containers/App';
import Input from 'components/Input';
import BackTextButton from 'components/BackTextButton';
import {translate} from '../translate';
import ThemeSetting from './Settings/Theme';
import './Settings.scss';

const config = remote.require('./config');
const t = translate('app');

const persistState = _.debounce((name, value) => config.set(name, value), 500);

class AppSettings extends React.Component {
	state = {
		marketmakerUrl: config.get('marketmakerUrl') || '',
	};

	handleChange = (value, event) => {
		const {name} = event.target;
		this.setState({[name]: value});
		persistState(name, value);
	};

	render() {
		const isValidMarketmakerUrl = this.state.marketmakerUrl.length < 1 || /^https?:\/\/.{4}/.test(this.state.marketmakerUrl);

		return (
			<div className="AppSettings">
				<div className="window-draggable-area"/>
				<header>
					<BackTextButton onClick={() => {
						appContainer.setActiveView('Login');
					}}/>
					<h2>{t('settings.title')}</h2>
				</header>
				<main>
					<ThemeSetting/>
					<div className="form-group">
						<label htmlFor="marketmakerUrl">
							{t('settings.customUrl')}
						</label>
						<Input
							name="marketmakerUrl"
							value={this.state.marketmakerUrl}
							onChange={this.handleChange}
							onBlur={() => {
								if (!isValidMarketmakerUrl) {
									this.setState({marketmakerUrl: ''});
								}
							}}
							placeholder={t('settings.exampleUrl', {
								url: 'http://localhost:7783',
								interpolation: {escapeValue: false},
							})}
							errorMessage={!isValidMarketmakerUrl && t('settings.invalidUrl')}
						/>
					</div>
				</main>
			</div>
		);
	}
}

export default AppSettings;
