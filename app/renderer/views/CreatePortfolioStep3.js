import React from 'react';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import LoginBackButton from '../components/LoginBackButton';

const CreatePortfolioStep3 = props => {
	return (
		<div className="CreatePortfolio">
			<LoginBackButton {...props} view="CreatePortfolioStep2" progress={0.50}/>
			<h1>Confirm Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<div className="form-group" style={{width: '460px'}}>
				<TextArea
					innerRef={props.setConfirmSeedPhraseTextArea}
					value={props.confirmedSeedPhrase}
					onChange={props.handleConfirmSeedPhraseInputChange}
					placeholder="Example: advanced generous profound …"
					errorMessage={props.seedPhraseError}
					autoFocus
					required
					preventNewlines
					style={{padding: '15px'}}
				/>
			</div>
			<div className="form-group">
				<Button
					primary
					value="Confirm"
					disabled={!props.confirmedSeedPhrase || props.seedPhraseError}
					onClick={props.handleStep3ClickConfirm}
					style={{
						width: '172px',
						marginTop: '18px',
					}}
				/>
			</div>
		</div>
	);
};

export default CreatePortfolioStep3;
