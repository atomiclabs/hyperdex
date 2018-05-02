import electron from 'electron';
import React from 'react';
import _ from 'lodash';
import Input from 'components/Input';
import TabView from './TabView';
import './Preferences.scss';

const config = electron.remote.require('./config');

class Form extends React.Component {
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
		return (
			<React.Fragment>
				<div className="form-group">
					<label htmlFor="marketmakerUrl">
						Custom Marketmaker URL: <small>(Requires app restart)</small>
					</label>
					<Input
						name="marketmakerUrl"
						value={this.state.marketmakerUrl}
						onChange={this.handleChange}
						placeholder="Example: http://localhost:7783"
					/>
				</div>
			</React.Fragment>
		);
	}
}

const Preferences = () => (
	<TabView title="Preferences" className="Preferences">
		<header>
			<h2>Preferences</h2>
		</header>
		<main>
			<Form/>
		</main>
	</TabView>
);

export default Preferences;
