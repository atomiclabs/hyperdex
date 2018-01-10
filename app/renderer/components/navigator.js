/* eslint-disable react/prop-types */
import electron from 'electron';
import React from 'react';
import {withRouter} from 'react-router-dom';

// This is responsible for programmatically controlling the routes from the main process
class Navigator extends React.Component {
	constructor(props) {
		super(props);

		electron.ipcRenderer.on('show-preferences', () => {
			props.history.push('/preferences');
		});
	}

	render() {
		return null;
	}
}

const NavigatorWithRouter = withRouter(Navigator);
export default NavigatorWithRouter;
