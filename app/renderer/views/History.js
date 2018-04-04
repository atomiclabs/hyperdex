import React from 'react';
import appContainer from 'containers/App';
import TabView from './TabView';
import './History.scss';

const History = () => {
	const currencies = appContainer.state.currencies.map(currency => (
		<tr key={currency.symbol}>
			<th>
				{currency.symbol}
			</th>
			<td>
				{currency.address}
			</td>
			<td>
				{currency.balance}
			</td>
		</tr>
	));

	return (
		<TabView title="History">
			<div>
				<table style={{maxHeight: 400}}>
					<thead>
						<tr>
							<th>
								Currency
							</th>
							<th>
								Smartaddress
							</th>
							<th>
								Balance
							</th>
						</tr>
					</thead>
					<tbody>
						{currencies}
					</tbody>
				</table>
			</div>
		</TabView>
	);
};

export default History;
