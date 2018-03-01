import React from 'react';
import {Subscribe} from 'unstated';
import AppContainer from '../containers/App';
import TabView from './TabView';

const Dashboard = () => (
	<Subscribe to={[AppContainer]}>
		{app => (
			<TabView title="Dashboard">
				<p>
					Portfolio:
				</p>
				<pre style={{color: '#ccc', overflow: 'scroll', height: '600px'}}>
					{JSON.stringify(app.state.currencies, null, '\t')}
				</pre>
			</TabView>
		)}
	</Subscribe>
);

export default Dashboard;
