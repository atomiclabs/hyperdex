import _ from 'lodash';
import plur from 'plur';
import appContainer from 'containers/App';
import {formatCurrency} from '../util';
import Container from './Container';

class DashboardContainer extends Container {
	state = {
		activeView: 'Portfolio',
	};

	setActiveView = activeView => {
		this.setState({activeView});
	};

	get assetCount() {
		const {length} = appContainer.state.currencies;
		return `${length} ${plur('asset', length)}`;
	}

	get totalAssetValue() {
		const total = _.sumBy(appContainer.state.currencies, 'cmcBalanceUsd');
		return formatCurrency(total);
	}
}

const dashboardContainer = new DashboardContainer();

export default dashboardContainer;
