import React from 'react';
import {classNames} from 'react-extras';
import dashboardContainer from 'containers/Dashboard';
import View from 'components/View';
import WalletInfo from './WalletInfo';
import WalletActivity from './WalletActivity';
import './Wallet.scss';

// TODO(sindresorhus): Refactor all the custom tab components into a shared reusable one
const TabButton = props => (
	<span
		className={
			classNames(
				'button',
				{
					active: props.activeView === props.component.name,
				}
			)
		}
		onClick={() => {
			props.setActiveView(props.component.name);
		}}
	>
		{props.title}
	</span>
);

const TabView = ({component, activeView}) => (
	<View component={component} activeView={activeView}/>
);

class Wallet extends React.Component {
	state = {
		activeView: 'WalletInfo',
	};

	setActiveView = activeView => {
		this.setState({activeView});
	};

	render() {
		const {activeCurrency} = dashboardContainer;

		return (
			<div className="Dashboard--Wallet">
				<header>
					<nav>
						<TabButton
							title={`${activeCurrency.symbol} Wallet`}
							component={WalletInfo}
							activeView={this.state.activeView}
							setActiveView={this.setActiveView}
						/>
						<TabButton
							title="Recent Activity"
							component={WalletActivity}
							activeView={this.state.activeView}
							setActiveView={this.setActiveView}
						/>
					</nav>
				</header>
				<TabView
					component={WalletInfo}
					activeView={this.state.activeView}
				/>
				<TabView
					component={WalletActivity}
					activeView={this.state.activeView}
				/>
			</div>
		);
	}
}

export default Wallet;
