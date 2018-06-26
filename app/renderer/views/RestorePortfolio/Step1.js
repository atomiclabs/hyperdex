import React from 'react';
import Button from 'components/Button';
import TextArea from 'components/TextArea';
import LoginBackButton from 'components/LoginBackButton';
import container from 'containers/RestorePortfolio';
import {translate} from '../../translate';

const t = translate('portfolio');

const RestorePortfolioStep1 = () => {
	const {state} = container;

	return (
		<div className="RestorePortfolio">
			<LoginBackButton view="NewPortfolio" progress={0}/>
			<h1>{t('restore.enterSeedPhrase')}</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<form onSubmit={container.handleStep1Submit} style={{marginTop: '20px'}}>
				<div className="form-group" style={{width: '460px'}}>
					<TextArea
						value={state.seedPhrase}
						onChange={container.handleSeedPhraseInputChange}
						placeholder={t('restore.exampleSeedPhrase', {seedPhrase: 'advanced generous profound'})}
						autoFocus
						required
						preventNewlines
						style={{padding: '15px'}}
					/>
				</div>
				<div className="form-group">
					<Button
						primary
						type="submit"
						value={t('restore.confirm')}
						disabled={!state.seedPhrase}
						style={{
							width: '172px',
							marginTop: '18px',
						}}
					/>
				</div>
			</form>
		</div>
	);
};

export default RestorePortfolioStep1;
