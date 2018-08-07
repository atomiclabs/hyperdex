import {remote} from 'electron';
import {appLaunchTimestamp} from 'electron-util';
import title from 'title';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import exchangeContainer from 'containers/Exchange';
import {translate} from './translate';

const t = translate('swap');

const {TouchBar} = remote;
const {TouchBarLabel, TouchBarSpacer} = TouchBar;

const portfolioValue = new TouchBarLabel();
const latestSwap = new TouchBarLabel();

const getLatestSwap = () => exchangeContainer.state.swapHistory.find(swap => swap.timeStarted > appLaunchTimestamp);

const updateTouchBar = () => {
	portfolioValue.label = `${appContainer.state.portfolio.name}: ${dashboardContainer.assetCount} ≈ ${dashboardContainer.totalAssetValueFormatted}`;

	const swap = getLatestSwap();
	latestSwap.label = swap ? `${swap.baseCurrency}/${swap.quoteCurrency} ${t(`details.${swap.orderType}`)} ${t('details.order')}: ${title(swap.statusFormatted)}` : '';

	latestSwap.textColor = swap ? (
		(swap.status === 'completed' && '#28af60' /* => var(--success-color) */) ||
		(swap.status === 'failed' && '#f80759' /* => var(--error-color) */)
	) : null;
};

const initTouchBar = () => {
	const touchBar = new TouchBar([
		portfolioValue,
		new TouchBarSpacer({size: 'flexible'}),
		latestSwap,
	]);

	remote.getCurrentWindow().setTouchBar(touchBar);

	appContainer.subscribe(() => {
		if (appContainer.isLoggedIn) {
			updateTouchBar();
		}
	});

	exchangeContainer.subscribe(updateTouchBar);
};

export default initTouchBar;
