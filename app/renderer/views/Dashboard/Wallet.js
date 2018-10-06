import React from 'react';
import dashboardContainer from 'containers/Dashboard';
import TabButton from 'components/TabButton';
import View from 'components/View';
import {translate} from '../../translate';
import WalletInfo from './WalletInfo';
import WalletActivity from './WalletActivity';
import './Wallet.scss';

const t = translate('dashboard');

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
		const [walletInfoComponentName, walletActivityComponentName] = [WalletInfo.name, WalletActivity.name];

		return (
			<div className="Dashboard--Wallet">
				<header>
					<nav>
						<TabButton
							active={this.state.activeView === walletInfoComponentName}
							onClick={() => this.setActiveView(walletInfoComponentName)}
						>
							{t('wallet.info', {symbol: activeCurrency.symbol})}
						</TabButton>
						<TabButton
							active={this.state.activeView === walletActivityComponentName}
							onClick={() => this.setActiveView(walletActivityComponentName)}
						>
							{t('wallet.recentActivity')}
						</TabButton>
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
