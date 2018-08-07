import {is} from 'electron-util';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import UNSTATED from 'unstated-debug';
import App from './views/App';
import touchBar from './touch-bar';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

UNSTATED.isEnabled = is.development;
UNSTATED.logStateChanges = false;

require('electron-unhandled')({
	showDialog: !is.development,
});

// Enable OS specific styles
document.documentElement.classList.add(`os-${process.platform}`);

// TODO: Wrap `<App>` in `<React.StrictMode>` sometime in the future when external components are updated to support it
render((
	<Provider>
		<App/>
	</Provider>
), document.querySelector('#root'));

touchBar();
