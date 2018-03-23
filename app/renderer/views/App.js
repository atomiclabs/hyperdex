import React from 'react';
import {hot} from 'react-hot-loader';
import {Subscribe} from 'unstated';
import '../styles/index.scss';
import View from 'components/View';
import AppContainer from 'containers/App';
import Login from './Login';
import Dashboard from './Dashboard';
import Swap from './Swap';
import Exchange from './Exchange';
import History from './History';
import Preferences from './Preferences';
import ComponentsPreview from './ComponentsPreview';

const App = () => (
	<Subscribe to={[AppContainer]}>
		{app => (
			<React.Fragment>
				<View component={Login} activeView={app.state.activeView}/>
				<View component={Dashboard} activeView={app.state.activeView}/>
				<View component={Swap} activeView={app.state.activeView}/>
				<View component={Exchange} activeView={app.state.activeView}/>
				<View component={History} activeView={app.state.activeView}/>
				<View component={Preferences} activeView={app.state.activeView}/>
				<View component={ComponentsPreview} activeView={app.state.activeView}/>
			</React.Fragment>
		)}
	</Subscribe>
);

export default hot(module)(App);
