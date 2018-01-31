import React from 'react';
import globalState from '../global-state';
import TabView from './TabView';

const Funds = props => {
	const coins = globalState.get().currencies.map(coin => (
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
		<TabView {...props} title="Funds">
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
