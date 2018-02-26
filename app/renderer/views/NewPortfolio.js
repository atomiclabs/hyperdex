import React from 'react';
import Button from '../components/Button';
import {sharedLoginContainer} from '../LoginContainer';
import LoginBackButton from '../components/LoginBackButton';
import './NewPortfolio.scss';

const NewPortfolio = () => (
	<div className="NewPortfolio">
		{sharedLoginContainer.state.portfolios.length > 0 &&
			<LoginBackButton view="LoginBox" progress={0}/>
		}
		<h1 style={{marginBottom: '24px'}}>Welcome to HyperDEX!</h1>
		<h2>Would you like to create a new portfolio<br/>or restore an existing one?</h2>
		<p style={{marginTop: '5px'}}>
			{'Create a new one if you don\'t have a seed phrase yet.'}
		</p>
		<div className="action-buttons">
			<Button
				value="Restore Portfolio"
				onClick={() => {
					sharedLoginContainer.setActiveView('RestorePortfolio');
					sharedLoginContainer.setProgress(0.33);
				}}
			/>
			<Button
				primary
				value="Create New Portfolio"
				onClick={() => {
					sharedLoginContainer.setActiveView('CreatePortfolio');
					sharedLoginContainer.setProgress(0.25);
				}}
			/>
		</div>
	</div>
);

export default NewPortfolio;
