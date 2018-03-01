import React from 'react';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import LoginBackButton from '../components/LoginBackButton';

const RestorePortfolioStep1 = props => {
	return (
		<div className="RestorePortfolio">
			<LoginBackButton view="NewPortfolio" progress={0}/>
			<h1>Enter Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<form onSubmit={props.handleStep1Submit} style={{marginTop: '20px'}}>
				<div className="form-group" style={{width: '460px'}}>
					<TextArea
						value={props.seedPhrase}
						onChange={props.handleSeedPhraseInputChange}
						placeholder="Example: advanced generous profound …"
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
						disabled={!props.seedPhrase}
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
