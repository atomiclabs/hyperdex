import electron from 'electron';
import React from 'react';

/* eslint-disable */

const config = electron.remote.require('./config');

class Form extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			marketmakerUrl: config.get('marketmakerUrl')
		};
	}

	handleChange(event) {
		const {name, value} = event.target;
		this.setState({[name]: value});
		config.set(name, value);
	}

	render() {
		return (
			<div>
				<label>
					<div>Custom Marketmaker URL: <small>(Requires app restart)</small></div>
					<input
						name="marketmakerUrl"
						value={this.state.marketmakerUrl}
						onChange={this.handleChange.bind(this)}
						placeholder="Example: http://localhost:7783"
						style={{width:'400px'}}
					/>
				</label>
			</div>
		);
	}
}

const Preferences = () => (
	<div>
		<h1>
			Preferences
		</h1>
		<br/>
		<Form/>
	</div>
);

export default Preferences;
