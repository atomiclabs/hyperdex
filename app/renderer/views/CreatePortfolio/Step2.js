import React from 'react';
import Button from '../../components/Button';
import LoginBackButton from '../../components/LoginBackButton';
import ReloadButton from '../../components/ReloadButton';
import CopyButton from '../../components/CopyButton';
import WrapWidth from '../../components/WrapWidth';
import {createPortfolioContainer as container} from '../../containers/CreatePortfolio';
import './CreatePortfolio.scss';

const CreatePortfolioStep2 = () => {
	// TODO(sindresorhus): Fill in the link to security best practices

	const {state} = container;

	return (
		<div className="CreatePortfolio">
			<LoginBackButton view="CreatePortfolioStep1" progress={0.25}/>
			<h1>Seed Phrase for Your Portfolio</h1>
			<div className="form-group" style={{width: '460px', marginTop: '20px'}}>
				<div className="generated-seed-phrase-container">
					<ReloadButton onClick={container.generateSeedPhrase}/>
					<WrapWidth wordsPerLine={6} className="seed-phrase">
						{state.generatedSeedPhrase}
					</WrapWidth>
					<CopyButton value={state.generatedSeedPhrase}/>
				</div>
				<div className="warning-box">
					<img className="icon" src="/assets/warning-icon.svg" width="30" height="30"/>
					<div className="content">
						<h3>Important: please back up your seed phrase now!</h3>
						<p>We recommend storing it offline. <a href="#">Learn more security best practices</a></p>
					</div>
				</div>
			</div>
			<div className="form-group">
				<Button
					value="Next"
					onClick={container.handleStep2ClickNext}
					style={{width: '172px', marginTop: '7px'}}
				/>
			</div>
		</div>
	);
};

export default CreatePortfolioStep2;
