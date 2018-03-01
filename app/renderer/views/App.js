import React from 'react';
import {hot} from 'react-hot-loader';
import {Subscribe} from 'unstated';
import '../styles/index.scss'; // eslint-disable-line import/extensions
import View from '../components/View';
import AppContainer from '../containers/App';
import Login from './Login';
import Dashboard from './Dashboard';
import Swap from './Swap';
import Exchange from './Exchange';
import Trades from './Trades';
import Funds from './Funds';
import Preferences from './Preferences';
import ComponentsPreview from './ComponentsPreview';

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
