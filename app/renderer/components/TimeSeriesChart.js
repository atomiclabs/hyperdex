import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import {format as formatDate, subMonths, subDays, subHours, subMinutes, getDaysInMonth} from 'date-fns';
import {formatCurrency} from '../util';
import './TimeSeriesChart.scss';

const CustomTooltip = ({payload}) => {
	// It's sometimes empty…
	if (!(payload && payload.length > 0)) {
		return null;
	}

	return (
		<div className="custom-tooltip">{formatCurrency(payload[0].payload.value)}</div>
	);
};

CustomTooltip.propTypes = Tooltip.propTypes;

const resolutionToLabelFormat = new Map([
	['hour', 'HH:mm'],
	['day', 'HH:mm dddd'],
	['week', 'dddd DD/MM'],
	['month', 'DD/MM'],
	['year', 'MMMM'],
	['all', 'MMMM YYYY'],
]);

const makeTicks = (count, fn) => {
	const now = new Date();
	return [...new Array(count).keys()].map(index => fn(now, index)).reverse();
};

const getTicks = resolution => {
	const ticks = {
		year: makeTicks(13, subMonths),
		month: makeTicks(getDaysInMonth(new Date()) + 1, subDays),
		week: makeTicks(8, subDays),
		day: makeTicks(25, subHours),
		hour: makeTicks(61, subMinutes),
	};
	return ticks[resolution];
};

class TimeSeriesChart extends React.Component {
	static propTypes = {
		data: PropTypes.arrayOf(
			PropTypes.shape({
				time: PropTypes.number.isRequired,
				value: PropTypes.number.isRequired,
			}).isRequired
		),
		resolution: PropTypes.string.isRequired,
	}

	static defaultProps = {
		data: [],
	};

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		const {
			data,
			resolution,
		} = this.props;

		const labelFormat = resolutionToLabelFormat.get(resolution);

		return (
			<div className="TimeSeriesChart">
				<ResponsiveContainer width="100%" minHeight={100}>
					<AreaChart data={data}>
						<Area
							dataKey="value"
							name="Value"
							stroke="var(--timeseries-chart-stroke)"
							fillOpacity={1}
							fill="var(--timeseries-chart-background-color)"
							isAnimationActive={false}
						/>
						<XAxis
							dataKey="time"
							name="Time"
							scale="time"
							domain={['auto', 'auto']}
							type="number"
							interval="preserveStartEnd"
							tickFormatter={unixTime => formatDate(new Date(unixTime), labelFormat)}
							ticks={getTicks(resolution)}
							axisLine={{
								stroke: 'transparent',
							}}
							tickLine={{
								stroke: 'transparent',
							}}
							tick={{
								fontSize: '12px',
								fill: 'var(--primary-color)',
							}}
						/>
						<YAxis
							hide
							domain={['auto', 'auto']}
							padding={{top: 5}}
						/>
						{data &&
							<Tooltip
								content={<CustomTooltip/>}
								isAnimationActive={false}
								animationDuration={0}
							/>
						}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default TimeSeriesChart;
