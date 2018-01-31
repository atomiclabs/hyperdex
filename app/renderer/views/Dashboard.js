import React from 'react';
import TabView from './TabView';

const Dashboard = props => (
	<TabView title="Dashboard" {...props}>
		<p>
			Portfolio:
		</p>
		<pre style={{color: '#ccc', overflow: 'scroll', height: '600px'}}>
			{JSON.stringify(props.currencies, null, '\t')}
		</pre>
	</TabView>
);

export default Dashboard;
