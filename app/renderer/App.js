import React from 'react';
import {hot} from 'react-hot-loader';
import {Subscribe} from 'unstated';
import './styles/index.scss';
import View from './components/View';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Swap from './views/Swap';
import Exchange from './views/Exchange';
import Trades from './views/Trades';
import Funds from './views/Funds';
import Preferences from './views/Preferences';
import ComponentsPreview from './views/ComponentsPreview';
import AppContainer from './AppContainer';

const App = () => (
	<Subscribe to={[AppContainer]}>
		{app => {
			const AppView = ({component}) => <View component={component} activeView={app.state.activeView}/>;

			return (
				<React.Fragment>
					<div className="window-draggable-area"/>

					<AppView component={Login}/>
					<AppView component={Dashboard}/>
					<AppView component={Swap}/>
					<AppView component={Exchange}/>
					<AppView component={Trades}/>
					<AppView component={Funds}/>
					<AppView component={Preferences}/>
					<AppView component={ComponentsPreview}/>
				</React.Fragment>
			);
		}}
	</Subscribe>
);

export default hot(module)(App);
