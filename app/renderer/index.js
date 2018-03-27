import {is} from 'electron-util';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import App from './views/App';

require('electron-unhandled')({
	showDialog: !is.development,
});

render((
	<Provider>
		<App/>
	</Provider>
), document.querySelector('#root'));
