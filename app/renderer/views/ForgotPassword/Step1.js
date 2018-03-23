import React from 'react';
import Button from 'components/Button';
import TextArea from 'components/TextArea';
import LoginBackButton from 'components/LoginBackButton';
import container from 'containers/ForgotPassword';
import './ForgotPassword.scss';

const ForgotPasswordStep1 = () => {
	const {state} = container;

	return (
		<div className="ForgotPassword">
			<LoginBackButton view="LoginBox" progress={0}/>
			<h1>Enter Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<div className="form-group" style={{width: '460px'}}>
				<TextArea
					value={state.seedPhrase}
					onChange={container.handleSeedPhraseInputChange}
					placeholder="Example: advanced generous profound …"
					autoFocus
					required
					preventNewlines
					errorMessage={state.seedPhraseError}
					style={{padding: '15px'}}
				/>
			</div>
			<div className="form-group">
				<Button
					primary
					value="Confirm"
					disabled={!state.seedPhrase}
					onClick={container.handleClickConfirmSeedPhrase}
					style={{width: '172px', marginTop: '18px'}}
				/>
			</div>
		</div>
	);
};

export default ForgotPasswordStep1;
