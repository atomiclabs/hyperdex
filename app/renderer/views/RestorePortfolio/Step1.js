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
			{/* <p>TODO: Put some explanation here on what to do.</p> */}
			<p></p>
			<form style={{marginTop: '20px'}} onSubmit={container.handleStep1Submit}>
				<div className="form-group" style={{width: '460px'}}>
					<TextArea
						required
						autoFocus
						preventNewlines
						value={state.seedPhrase}
						placeholder={t('restore.exampleSeedPhrase', {seedPhrase: 'advanced generous profound'})}
						style={{padding: '15px'}}
						onChange={container.handleSeedPhraseInputChange}
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
