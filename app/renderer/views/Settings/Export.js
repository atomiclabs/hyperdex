import path from 'path';
import fs from 'fs';
import {remote, shell} from 'electron';
import React from 'react';
import CSV from 'csv-string';
import title from 'title';
import slugify from '@sindresorhus/slugify';
import {format as formatDate} from 'date-fns';
import appContainer from 'containers/App';
import Button from 'components/Button';
import {translate} from '../../translate';

const {app, dialog} = remote;

const t = translate('settings');

const generateCSV = async () => {
	const swaps = await appContainer.swapDB.getSwaps();

	const header = [
		'Timestamp',
		'Pairs',
		'Type',
		'Sent Amount',
		'Received Amount',
		'Status',
		'Fee TXID',
		'Sent TXID',
		'Recieved TXID',
	];

	const getTXID = (swap, stage) => {
		const transaction = swap.transactions.find(x => x.stage === stage);
		return transaction ? transaction.txid : '';
	};

	const rows = swaps.map(swap => [
		formatDate(swap.timeStarted, 'YYYY-MM-DD HH:mm:ss'), // The most Excel compatible datetime format
		`${swap.baseCurrency}/${swap.quoteCurrency}`,
		title(swap.orderType),
		`${swap.baseCurrencyAmount} ${swap.baseCurrency}`,
		`${swap.quoteCurrencyAmount} ${swap.quoteCurrency}`,
		title(swap.statusFormatted),
		getTXID(swap, 'myfee'),
		getTXID(swap, 'alicepayment'),
		getTXID(swap, 'alicespend'),
	]);

	// Cannot use `,` as separator as it's not compatible with Excel
	return CSV.stringify([header, ...rows], ';');
};

class Export extends React.Component {
	state = {}

	handleClick = async () => {
		const portfolioNameSlug = slugify(appContainer.state.portfolio.name).slice(0, 20);
		const filename = `hyperdex-${t('export.trades')}-${portfolioNameSlug}-${formatDate(Date.now(), 'YYYY-MM-DD')}`;

		const filePath = dialog.showSaveDialog(remote.getCurrentWindow(), {
			title: t('export.exportTradeHistory'),
			defaultPath: path.join(app.getPath('downloads'), filename),
			buttonLabel: 'Export',
			filters: [
				{
					name: 'CSV',
					extensions: ['csv'],
				},
			],
		});

		if (!filePath) {
			return;
		}

		fs.writeFileSync(filePath, await generateCSV());
		shell.showItemInFolder(filePath);
	};

	render() {
		/// TODO: Use async rendering here when it's out in React
		if (this.state.swapCount === undefined) {
			(async () => {
				this.setState({swapCount: await appContainer.swapDB.getSwapCount()});
			})();
		}

		return (
			<div className="form-group">
				<label style={{marginBottom: '10px'}}>{t('export.sectionLabel')}</label>
				<Button
					value={t('export.exportTradeHistory')}
					onClick={this.handleClick}
					disabled={!(this.state.swapCount > 0)}
				/>
			</div>
		);
	}
}

export default Export;
