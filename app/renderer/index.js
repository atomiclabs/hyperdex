import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import App from './views/App';
import {appContainer} from './containers/App';
import {loginContainer} from './containers/Login';

require('electron-unhandled')();

render((
	<Provider inject={[appContainer, loginContainer]}>
		<App/>
	</Provider>
), document.querySelector('#root'));
