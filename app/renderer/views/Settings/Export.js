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
		'Base Amount',
		'Quote Amount',
		'Status',
	];

	const rows = swaps.map(swap => [
		formatDate(swap.timeStarted, 'YYYY-MM-DD HH:mm:ss'), // The most Excel compatible datetime format
		`${swap.baseCurrency}/${swap.quoteCurrency}`,
		title(swap.orderType),
		`${swap.baseCurrencyAmount} ${swap.baseCurrency}`,
		`${swap.quoteCurrencyAmount} ${swap.quoteCurrency}`,
		title(swap.statusFormatted),
	]);

	// Cannot use `,` as separator as it's not compatible with Excel
	return CSV.stringify([header, ...rows], ';');
};

class Export extends React.Component {
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
		return (
			<div className="form-group">
				<label style={{marginBottom: '10px'}}>{t('export.sectionLabel')}</label>
				<Button
					value={t('export.exportTradeHistory')}
					onClick={this.handleClick}
				/>
			</div>
		);
	}
}

export default Export;
