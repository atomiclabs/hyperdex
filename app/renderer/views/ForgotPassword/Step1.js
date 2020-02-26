import React from 'react';
import Button from 'components/Button';
import TextArea from 'components/TextArea';
import LoginBackButton from 'components/LoginBackButton';
import container from 'containers/ForgotPassword';
import {translate} from '../../translate';
import './ForgotPassword.scss';

const t = translate('forgot-password');

const ForgotPasswordStep1 = () => {
	const {state} = container;

	return (
		<div className="ForgotPassword">
			<LoginBackButton view="LoginBox" progress={0}/>
			<h1>{t('enterSeedPhrase')}</h1>
			{/* <p>TODO: Put some explanation here on what to do.</p> */}
			<p></p>
			<div className="form-group" style={{width: '460px'}}>
				<TextArea
					required
					autoFocus
					preventNewlines
					value={state.seedPhrase}
					placeholder={t('exampleSeedPhrase', {seedPhrase: 'advanced generous profound'})}
					errorMessage={state.seedPhraseError}
					style={{padding: '15px'}}
					onChange={container.handleSeedPhraseInputChange}
				/>
			</div>
			<div className="form-group">
				<Button
					primary
					value={t('confirm')}
					disabled={!state.seedPhrase}
					style={{
						width: '172px',
						marginTop: '18px',
					}}
					onClick={container.handleClickConfirmSeedPhrase}
				/>
			</div>
		</div>
	);
};

export default ForgotPasswordStep1;
