import electron from 'electron';
import React from 'react';
import TabView from './tab-view';

/* eslint-disable */

const portfolio = electron.remote.require('./portfolio');

export default class Funds extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			coins: [],
		};

		(async () => {
			this.setState({
				coins: await this.props.portfolio.api.coins(),
			});
		})();
	}

	render() {
		const coins = this.state.coins.map(coin => (
			<tr key={coin.coin}>
				<th>{coin.coin}</th>
				<td>{coin.smartaddress}</td>
				<td>{coin.balance}</td>
			</tr>
		));

		return (
			<TabView {...this.props} title="Funds">
				<div style={{overflow: 'auto', maxHeight: 400}}>
					<table class="table">
						<thead>
							<tr>
								<th>Coin</th>
								<th>Smartaddress</th>
								<th>Balance</th>
							</tr>
						</thead>
						<tbody>
							{coins}
						</tbody>
					</table>
				</div>
			</TabView>
		);
	}
}
