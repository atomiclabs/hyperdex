import React from 'react';
import {Subscribe} from 'unstated';
import dashboardContainer from 'containers/Dashboard';
import TabView from 'views/TabView';
import List from './List';
import Chart from './Chart';
import Activity from './Activity';
import PieChart from './PieChart';
import Wallet from './Wallet';
import './Dashboard.scss';

const Dashboard = () => {
	return (
		<Subscribe to={[dashboardContainer]}>
			{container => {
				const {state} = container;

				if (state.activeView === 'Portfolio') {
					return (
						<TabView className="Dashboard Dashboard--Portfolio">
							<List/>
							<Activity/>
							<PieChart/>
						</TabView>
					);
				}

				return (
					<TabView className="Dashboard">
						<List/>
						<Chart/>
						<Wallet/>
					</TabView>
				);
			}}
		</Subscribe>
	);
};

export default Dashboard;
