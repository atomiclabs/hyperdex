import React from 'react';
import Button from 'components/Button';
import LoginBackButton from 'components/LoginBackButton';
import ReloadButton from 'components/ReloadButton';
import CopyButton from 'components/CopyButton';
import WrapWidth from 'components/WrapWidth';
import ExternalLink from 'components/ExternalLink';
import Tooltip from 'components/Tooltip';
import container from 'containers/CreatePortfolio';
import {withState} from 'containers/SuperContainer';
import './CreatePortfolio.scss';

const CreatePortfolioStep2 = ({setState, ...props}) => {
	// TODO(sindresorhus): Fill in the link to security best practices

	const {isCopied} = props.state;
	const {state} = container;

	return (
		<div className="CreatePortfolio">
			<LoginBackButton view="CreatePortfolioStep1" progress={0.25}/>
			<h1>Seed Phrase for Your Portfolio</h1>
			<div className="form-group" style={{width: '460px', marginTop: '20px'}}>
				<div className="generated-seed-phrase-container">
					<div className="button button--reload">
						<ReloadButton onClick={() => {
							container.generateSeedPhrase();
							setState({isCopied: false});
						}}/>
					</div>
					<div className="seed-phrase">
						<WrapWidth wordsPerLine={6}>
							{state.generatedSeedPhrase}
						</WrapWidth>
					</div>
					<div className="button button--copy">
						<Tooltip
							content={isCopied ? 'Copied' : 'Copy'}
							onClose={() => {
								setState({isCopied: false});
							}}
						>
							<CopyButton
								value={state.generatedSeedPhrase}
								onClick={() => {
									setState({isCopied: true});
								}}
							/>
						</Tooltip>
					</div>
				</div>
				<div className="warning-box">
					<img className="icon" src="/assets/warning-icon.svg" width="30" height="30"/>
					<div className="content">
						<h3>Important: please back up your seed phrase now!</h3>
						<p>We recommend storing it offline. <ExternalLink url="https://github.com/hyperdexapp/hyperdex/wiki/Security-Best-Practices">Learn more security best practices</ExternalLink></p>
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

export default withState(CreatePortfolioStep2, {isCopied: false});
