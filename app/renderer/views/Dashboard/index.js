import React from 'react';
import {Subscribe} from 'unstated';
import dashboardContainer from 'containers/Dashboard';
import exchangeContainer from 'containers/Exchange';
import TabView from 'views/TabView';
import Intro from './Intro';
import List from './List';
import Chart from './Chart';
import Activity from './Activity';
import PieChart from './PieChart';
import Wallet from './Wallet';
import './Dashboard.scss';

const Dashboard = () => {
	return (
		<Subscribe to={[dashboardContainer, /* Temp => */exchangeContainer]}>
			{container => {
				const {state} = container;

				if (state.activeView === 'Portfolio') {
					return (
						<TabView className="Dashboard Dashboard--Portfolio">
							<Intro/>
							<List/>
							<Chart/>
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

export default dashboardContainer.connect(Dashboard);
