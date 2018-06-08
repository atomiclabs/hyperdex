import {remote} from 'electron';
import React from 'react';
import _ from 'lodash';
import appContainer from 'containers/App';
import Input from 'components/Input';
import BackButton from 'components/BackButton';
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
				<BackButton onClick={() => {
					appContainer.setActiveView('Login');
				}}/>
				<header>
					<h2>Settings</h2>
				</header>
				<main>
					<div className="section">
						<h3>App</h3>
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
					</div>
					<div className="section">
						<h3>Portfolio</h3>
						<p>Log in to see portfolio settings.</p>
					</div>
				</main>
			</div>
		);
	}
}

export default AppSettings;
