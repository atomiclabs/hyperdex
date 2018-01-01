// - import electron from 'electron';
import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
	render() {
		return (
			<h1>
				{'⚡️ HyperDEX'}
			</h1>
		);
	}
}

render(<App/>, document.querySelector('#app'));
