import {hot} from 'react-hot-loader';
import React from 'react';
import {Subscribe} from 'unstated';
import '../styles/index.scss';
import appContainer from 'containers/App';
import AppView from 'components/AppView';
import Login from './Login';
import Dashboard from './Dashboard';
import Swap from './Swap';
import Exchange from './Exchange';
import Trades from './Trades';
import Preferences from './Preferences';
import ComponentsPreview from './ComponentsPreview';

const App = () => (
	<Subscribe to={[appContainer]}>
		{() => (
			<React.Fragment>
				<AppView component={Login}/>
				<AppView component={Dashboard}/>
				<AppView component={Swap}/>
				<AppView component={Exchange}/>
				<AppView component={Trades}/>
				<AppView component={Preferences}/>
				<AppView component={ComponentsPreview}/>
			</React.Fragment>
		)}
	</Subscribe>
);

export default hot(module)(App);
