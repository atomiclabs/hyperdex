import React from 'react';
import {classNames} from 'react-extras';
import TimeSeriesChart from 'components/TimeSeriesChart';
import dashboardContainer from 'containers/Dashboard';
import './Chart.scss';

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

const Chart = () => {
	const {state} = dashboardContainer;
	const {portfolioHistory, currencyHistory, activeView} = state;
	const symbol = dashboardContainer.activeCurrencySymbol;

	let data;
	if (activeView === 'Portfolio') {
		data = portfolioHistory[state.currencyHistoryResolution];
	} else {
		data = currencyHistory[state.currencyHistoryResolution][symbol];
	}

	if (!data) {
		return (
			<div className="Dashboard--Chart Empty">
				<p>No data available</p>
			</div>
		);
	}

	return (
		<div className="Dashboard--Chart">
			<TimeSeriesChart
				data={data}
				resolution={state.currencyHistoryResolution}
			/>
			<div className="overlay">
				<h3>{activeView === 'Portfolio' ? 'Portfolio Value' : `${symbol} Chart`}</h3>
				<div className="resolution-buttons">
					<ResolutionButton title="1h" resolution="hour"/>
					<ResolutionButton title="1d" resolution="day"/>
					<ResolutionButton title="1w" resolution="week"/>
					<ResolutionButton title="1m" resolution="month"/>
					<ResolutionButton title="1y" resolution="year"/>
					<ResolutionButton title="All" resolution="all"/>
				</div>
			</div>
		</div>
	);
};

export default Chart;
