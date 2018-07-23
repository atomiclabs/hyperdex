import React from 'react';
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

const resolutionToLabelFormat = new Map([
	['hour', 'HH:mm'],
	['day', 'HH:mm dddd'],
	['week', 'dddd DD/MM'],
	['month', 'DD/MM'],
	['year', 'MMMM'],
	['all', 'MMMM YYYY'],
]);

class TimeSeriesChart extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		const {
			data,
			resolution,
		} = this.props;

		console.log(data);

		const labelFormat = resolutionToLabelFormat.get(resolution);

		const getTicks = (resolution) => {
			const ticks = {
				"all": undefined,
				"year": [...Array(13).keys()].map(index => subMonths(new Date(), index)).reverse(),
				"month": [...Array(getDaysInMonth(new Date()) + 1).keys()].map(index => subDays(new Date(), index)).reverse(),
				"week": [...Array(8).keys()].map(index => subDays(new Date(), index)).reverse(),
				"day": [...Array(25).keys()].map(index => subHours(new Date(), index)).reverse(),
				"hour": [...Array(61).keys()].map(index => subMinutes(new Date(), index)).reverse(),
			}
			return ticks[resolution]
		}
		const getDomain = (resolution) => {
			const domain = {
				"all": ['auto', 'auto'],
				"year": [subMonths(new Date(), 13), 'auto'],
				"month": [subDays(new Date(), getDaysInMonth(new Date()) + 1), 'auto'],
				"week": [subDays(new Date(), 8), 'auto'],
				"day": [subHours(new Date(), 25), 'auto'],
				"hour": [subMinutes(new Date(), 61), 'auto']
			}
			return domain[resolution]
		}

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
							domain={getDomain(resolution)}
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
							domain={['auto', 'auto']}
							padding={{top: 5}}
							hide
						/>
						{data &&
							<Tooltip content={<CustomTooltip/>} isAnimationActive={false} animationDuration={0}/>
						}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default TimeSeriesChart;
