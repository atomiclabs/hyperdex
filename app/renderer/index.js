/// import electronUnhandled from 'electron-unhandled';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import UNSTATED from 'unstated-debug';
import App from './views/App';

const {is} = global.mainModules.electronUtil;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

UNSTATED.isEnabled = is.development;
UNSTATED.logStateChanges = false;

/// electronUnhandled({
// 	showDialog: !is.development,
// });

// Enable OS specific styles
document.documentElement.classList.add(`os-${process.platform}`);

render((
	<Provider>
		<App/>
	</Provider>
), document.querySelector('#root'));
