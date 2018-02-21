import React from 'react';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import LoginBackButton from '../components/LoginBackButton';

const ForgotPasswordStep1 = props => {
	return (
		<div className="ForgotPassword">
			<LoginBackButton {...props} view="LoginBox" progress={0}/>
			<h1>Enter Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<div className="form-group" style={{width: '460px'}}>
				<TextArea
					value={props.seedPhrase}
					onChange={props.handleSeedPhraseInputChange}
					placeholder="Example: advanced generous profound …"
					autoFocus
					required
					preventNewlines
					level={props.seedPhraseError && 'danger'}
					text={props.seedPhraseError}
					style={{padding: '15px'}}
				/>
			</div>
			<div className="form-group">
				<Button
					primary
					value="Confirm"
					disabled={!props.seedPhrase}
					onClick={props.handleClickConfirmSeedPhrase}
					style={{width: '172px', marginTop: '18px'}}
				/>
			</div>
		</div>
	);
};

export default ForgotPasswordStep1;
