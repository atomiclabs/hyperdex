import React from 'react';
import Button from '../../components/Button';
import TextArea from '../../components/TextArea';
import LoginBackButton from '../../components/LoginBackButton';
import {createPortfolioContainer as container} from '../../containers/CreatePortfolio';
import './CreatePortfolio.scss';

const CreatePortfolioStep3 = () => {
	const {state} = container;

	return (
		<div className="CreatePortfolio">
			<LoginBackButton view="CreatePortfolioStep2" progress={0.50}/>
			<h1>Confirm Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<form onSubmit={container.handleStep3Submit} style={{marginTop: '20px'}}>
				<div className="form-group" style={{width: '460px'}}>
					<TextArea
						innerRef={textarea => {
							container.confirmSeedPhraseTextArea = textarea;
						}}
						value={state.confirmedSeedPhrase}
						onChange={container.handleConfirmSeedPhraseInputChange}
						placeholder="Example: advanced generous profound …"
						errorMessage={state.seedPhraseError}
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
						value="Confirm"
						disabled={!state.confirmedSeedPhrase || state.seedPhraseError}
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

export default CreatePortfolioStep3;
