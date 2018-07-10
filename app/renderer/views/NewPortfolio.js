import React from 'react';
import {Trans} from 'react-i18next';
import Button from 'components/Button';
import loginContainer from 'containers/Login';
import LoginBackButton from 'components/LoginBackButton';
import {instance, translate} from '../translate';
import './NewPortfolio.scss';

const t = translate('portfolio');

const NewPortfolio = () => (
	<div className="NewPortfolio">
		{loginContainer.state.portfolios.length > 0 &&
			<LoginBackButton view="LoginBox" progress={0}/>
		}
		<Trans i18n={instance} i18nKey="new.createOrRestoreTitle" t={t}>
			<h2>Would you like to create a new portfolio<br/>or restore an existing one?</h2>
		</Trans>
		<p style={{marginTop: '5px'}}>
			{t('new.createOrRestoreDescription')}
		</p>
		<div className="action-buttons">
			<Button
				value={t('new.restorePortfolio')}
				onClick={() => {
					loginContainer.setActiveView('RestorePortfolioStep1');
					loginContainer.setProgress(0.33);
				}}
			/>
			<Button
				primary
				value={t('new.createPortfolio')}
				onClick={() => {
					loginContainer.setActiveView('CreatePortfolioStep1');
					loginContainer.setProgress(0.25);
				}}
			/>
		</div>
	</div>
);

export default NewPortfolio;
