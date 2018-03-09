import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'unstated';
import App from './views/App';
import {appContainer} from './containers/App';
import {loginContainer} from './containers/Login';
import {createPortfolioContainer} from './containers/CreatePortfolio';
import {restorePortfolioContainer} from './containers/RestorePortfolio';
import {forgotPasswordContainer} from './containers/ForgotPassword';
import {exchangeContainer} from './containers/Exchange';

require('electron-unhandled')();

render((
	<Provider
		inject={[
			appContainer,
			loginContainer,
			createPortfolioContainer,
			restorePortfolioContainer,
			forgotPasswordContainer,
			exchangeContainer,
		]}
	>
		<App/>
	</Provider>
), document.querySelector('#root'));
