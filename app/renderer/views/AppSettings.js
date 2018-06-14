import {remote} from 'electron';
import React from 'react';
import _ from 'lodash';
import appContainer from 'containers/App';
import Input from 'components/Input';
import BackTextButton from 'components/BackTextButton';
import './Settings.scss';

const config = remote.require('./config');

class AppSettings extends React.Component {
	state = {
		marketmakerUrl: config.get('marketmakerUrl') || '',
	};

	persistState = _.debounce((name, value) => {
		config.set(name, value);
	}, 500);

	handleChange = (value, event) => {
		const {name} = event.target;
		this.setState({[name]: value});
		this.persistState(name, value);
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
					<h2>App Settings</h2>
				</header>
				<main>
					<div className="form-group">
						<label htmlFor="marketmakerUrl">
							Custom Marketmaker URL:
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
							placeholder="Example: http://localhost:7783"
							errorMessage={!isValidMarketmakerUrl && 'Invalid URL'}
						/>
					</div>
				</main>
			</div>
		);
	}
}

export default AppSettings;
