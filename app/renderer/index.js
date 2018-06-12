import {remote} from 'electron';
import {is} from 'electron-util';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import UNSTATED from 'unstated-debug';
import {I18nextProvider} from 'react-i18next';
import App from './views/App';

const {i18n} = remote.require('./locale');

UNSTATED.isEnabled = is.development;
UNSTATED.logStateChanges = false;

require('electron-unhandled')({
	showDialog: !is.development,
});

// Enable OS specific styles
document.documentElement.classList.add(`os-${process.platform}`);

render((
	<Provider>
		<I18nextProvider i18n={i18n}>
			<App/>
		</I18nextProvider>
	</Provider>
), document.querySelector('#root'));
