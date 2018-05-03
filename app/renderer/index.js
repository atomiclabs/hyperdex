import {is} from 'electron-util';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import UNSTATED from 'unstated-debug';
import App from './views/App';

UNSTATED.isEnabled = is.development;
UNSTATED.logStateChanges = false;

require('electron-unhandled')({
	showDialog: !is.development,
});

// Enable OS specific styles
document.documentElement.classList.add(`os-${process.platform}`);

render((
	<Provider>
		<App/>
	</Provider>
), document.querySelector('#root'));
