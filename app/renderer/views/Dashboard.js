import React from 'react';
import {appContainer} from '../containers/App';
import TabView from './TabView';

const Dashboard = () => (
	<TabView title="Dashboard">
		<p>
			Portfolio:
		</p>
		<pre style={{color: '#ccc', overflow: 'scroll', height: '600px'}}>
			{JSON.stringify(appContainer.state.currencies, null, '\t')}
		</pre>
	</TabView>
);

export default Dashboard;
