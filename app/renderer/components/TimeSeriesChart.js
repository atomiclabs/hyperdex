import React from 'react';
import {ResponsiveContainer, AreaChart, Area, XAxis, Tooltip} from 'recharts';
import {format as formatDate} from 'date-fns';
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
	['hour', 'HH:mm:ss'],
	['day', 'HH:mm DD.MM'],
	['week', 'dddd DD.MM'],
	['month', 'DD.MM'],
	['year', 'MMMM'],
	['all', 'MMMM YYYY'],
]);

const TimeSeriesChart = props => {
	const labelFormat = resolutionToLabelFormat.get(props.resolution);

	return (
		<div className="TimeSeriesChart">
			<ResponsiveContainer width="100%" minHeight={100}>
				<AreaChart data={props.data}>
					<Area
						dataKey="value"
						name="Value"
						stroke="#8050ef"
						fillOpacity={1}
						fill="#313b5e"
						isAnimationActive={false}
					/>
					<XAxis
						dataKey="time"
						name="Time"
						scale="time"
						domain={['auto', 'auto']}
						type="number"
						tickFormatter={unixTime => formatDate(new Date(unixTime), labelFormat)}
						axisLine={{
							stroke: 'transparent',
						}}
						tickLine={{
							stroke: 'transparent',
						}}
						tick={{
							fontSize: '12px',
							fill: '#687bf7',
						}}
					/>
					<Tooltip content={<CustomTooltip/>} isAnimationActive={false} animationDuration={0}/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TimeSeriesChart;
