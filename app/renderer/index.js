import {remote} from 'electron';
import {is} from 'electron-util';
import unhandled from 'electron-unhandled';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import UNSTATED from 'unstated-debug';
import filterConsole from 'filter-console';
import App from './views/App';
import touchBar from './touch-bar';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

filterConsole([
	'Warning: React does not recognize the `clearableValue` prop on a DOM element.',
]);

UNSTATED.isEnabled = is.development;
UNSTATED.logStateChanges = false;

unhandled({
	reportButton: error => {
		const {reportError} = remote.require('./util');
		// FIXME: Have to pass the stack as Electron doesn't correctly serialize errors
		reportError(error.stack);
	},
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
