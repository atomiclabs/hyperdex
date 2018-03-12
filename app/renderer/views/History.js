import React from 'react';
import {appContainer} from 'containers/App';
import TabView from './TabView';

const History = () => {
	const coins = appContainer.state.currencies.map(coin => (
		<tr key={coin.coin}>
			<th>
				{coin.coin}
			</th>
			<td>
				{coin.address}
			</td>
			<td>
				{coin.balance}
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
								Coin
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
						{coins}
					</tbody>
				</table>
			</div>
		</TabView>
	);
};

export default History;
