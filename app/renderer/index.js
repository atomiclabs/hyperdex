import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import App from './App';
import {sharedAppContainer} from './AppContainer';
import {sharedLoginContainer} from './LoginContainer';

require('electron-unhandled')();

render((
	<Provider inject={[sharedAppContainer, sharedLoginContainer]}>
		<App/>
	</Provider>
), document.querySelector('#root'));
