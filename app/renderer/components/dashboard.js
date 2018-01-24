import React from 'react';
import TabView from './tab-view';

/* eslint-disable */

const Dashboard = props => (
	<TabView {...props}  title="Dashboard">
			<p>Portfolio:</p>
			<pre style={{color: '#ccc', overflow: 'scroll', height: '600px'}}>{JSON.stringify(props.currencies, null, '\t')}</pre>
	</TabView>
);

export default Dashboard;
