import React from 'react';
import _ from 'lodash';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
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

class TimeSeriesChart extends React.Component {
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
