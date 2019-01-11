import React from 'react';
import {Trans} from 'react-i18next';
import Button from 'components/Button';
import LoginBackButton from 'components/LoginBackButton';
import ExternalLink from 'components/ExternalLink';
import SeedPhrase from 'components/SeedPhrase';
import container from 'containers/CreatePortfolio';
import {instance, translate} from '../../translate';
import './CreatePortfolio.scss';

const t = translate(['portfolio']);

const CreatePortfolioStep2 = () => {
	// TODO(sindresorhus): Fill in the link to security best practices
	const {state} = container;

	return (
		<div className="CreatePortfolio">
			<LoginBackButton view="CreatePortfolioStep1" progress={0.25}/>
			<h1>{t('create.seedPhrase')}</h1>
			<div className="form-group" style={{width: '460px', marginTop: '20px'}}>
				<SeedPhrase
					showReload
					value={state.generatedSeedPhrase}
					onReload={() => {
						container.generateSeedPhrase();
					}}
				/>
				<div className="warning-box">
					<img className="icon" src="/assets/warning-icon.svg" width="30" height="30"/>
					<div className="content">
						<h3>{t('create.securityTitle')}</h3>
						<Trans i18n={instance} i18nKey="create.securityDescription" t={t}>
							<p>We recommend storing it offline. <ExternalLink url="https://github.com/atomiclabs/hyperdex/wiki/Security-Best-Practices">Learn more security best practices</ExternalLink></p>
						</Trans>
					</div>
				</div>
			</div>
			<div className="form-group">
				<Button
					value={t('create.next')}
					style={{
						width: '172px',
						marginTop: '7px',
					}}
					onClick={container.handleStep2ClickNext}
				/>
			</div>
		</div>
	);
};

export default CreatePortfolioStep2;
