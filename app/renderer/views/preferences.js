import electron from 'electron';
import React from 'react';
import _ from 'lodash';
import TabView from './tab-view';

const config = electron.remote.require('./config');

class Form extends React.Component {
	state = {
		marketmakerUrl: config.get('marketmakerUrl'),
	};

	persistState = _.debounce((name, value) => {
		config.set(name, value);
	}, 500);

	handleChange = event => {
		const {name, value} = event.target;
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
					<input
						className="form-control"
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

const Preferences = props => (
	<TabView {...props} title="Preferences">
		<Form/>
	</TabView>
);

export default Preferences;
