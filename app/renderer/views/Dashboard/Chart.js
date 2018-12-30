import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import TimeSeriesChart from 'components/TimeSeriesChart';
import dashboardContainer from 'containers/Dashboard';
import {translate} from '../../translate';
import './Chart.scss';

const t = translate('dashboard');

const ResolutionButton = props => {
	const setResolution = () => {
		dashboardContainer.setCurrencyHistoryResolution(props.resolution);
	};

	const className = classNames({
		active: props.resolution === dashboardContainer.state.currencyHistoryResolution,
	});

	return (
		<button
			className={className}
			type="button"
			onClick={setResolution}
		>
			{props.title}
		</button>
	);
};

ResolutionButton.propTypes = {
	resolution: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

const Chart = () => {
	const {state} = dashboardContainer;
	const {portfolioHistory, currencyHistory, activeView} = state;
	const symbol = dashboardContainer.activeCurrencySymbol;

	// TODO: Add a indicator for when the stats are loading when React supports Suspense fetching

	const getHistory = resolution => {
		return activeView === 'Portfolio' ?
			portfolioHistory[resolution] :
			currencyHistory[resolution][symbol];
	};

	const data = getHistory(state.currencyHistoryResolution);

	const hasDataInAtLeastOneResolution = Object.keys(currencyHistory).some(resolution => {
		const history = getHistory(resolution);
		return history && history.length > 0;
	});

	return (
		<div className="Dashboard--Chart">
			<TimeSeriesChart
				data={data}
				resolution={state.currencyHistoryResolution}
			/>
			<div className="overlay">
				<h3>{activeView === 'Portfolio' ? t('chart.portfolioValue') : t('chart.symbolChart', {symbol})}</h3>
				{hasDataInAtLeastOneResolution &&
					<div className="resolution-buttons">
						<ResolutionButton title="1h" resolution="hour"/>
						<ResolutionButton title="1d" resolution="day"/>
						<ResolutionButton title="1w" resolution="week"/>
						<ResolutionButton title="1m" resolution="month"/>
						<ResolutionButton title="1y" resolution="year"/>
						<ResolutionButton title="All" resolution="all"/>
					</div>
				}
			</div>
			{!data &&
				<div className="Empty">
					<p>{t('chart.noData')}</p>
				</div>
			}
		</div>
	);
};

export default Chart;
