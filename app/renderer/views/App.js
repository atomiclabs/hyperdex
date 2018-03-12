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
		{app => {
			const AppView = ({component}) => <View component={component} activeView={app.state.activeView}/>;

			return (
				<React.Fragment>
					<AppView component={Login}/>
					<AppView component={Dashboard}/>
					<AppView component={Swap}/>
					<AppView component={Exchange}/>
					<AppView component={History}/>
					<AppView component={Preferences}/>
					<AppView component={ComponentsPreview}/>
				</React.Fragment>
			);
		}}
	</Subscribe>
);

export default hot(module)(App);
