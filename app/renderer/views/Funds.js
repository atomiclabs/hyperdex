import React from 'react';
import {appContainer} from '../containers/App';
import TabView from './TabView';

const Funds = () => {
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
		<TabView title="Funds">
			<div style={{overflow: 'auto', maxHeight: 400}}>
				<table className="table">
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

export default Funds;
