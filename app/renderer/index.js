import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import App from './views/App';
import {sharedAppContainer} from './containers/App';
import {sharedLoginContainer} from './containers/Login';

require('electron-unhandled')();

render((
	<Provider inject={[sharedAppContainer, sharedLoginContainer]}>
		<App/>
	</Provider>
), document.querySelector('#root'));
