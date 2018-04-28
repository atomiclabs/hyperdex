import {hot} from 'react-hot-loader';
import React from 'react';
import {Subscribe} from 'unstated';
import '../styles/index.scss';
import rootContainer from 'containers/App';
import RootView from 'components/RootView';
import Login from './Login';
import App from './App';
import ComponentsPreview from './ComponentsPreview';

const Root = () => (
	<Subscribe to={[rootContainer]}>
		{() => (
			<React.Fragment>
				<RootView component={Login}/>
				<RootView component={App}/>
				<RootView component={ComponentsPreview}/>
			</React.Fragment>
		)}
	</Subscribe>
);

export default hot(module)(Root);
