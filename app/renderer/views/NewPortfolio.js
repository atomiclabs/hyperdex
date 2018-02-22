import React from 'react';
import Button from '../components/Button';
import LoginBackButton from '../components/LoginBackButton';
import './NewPortfolio.scss';

const NewPortfolio = props => (
	<div className="NewPortfolio">
		{props.portfolios.length > 0 &&
			<LoginBackButton {...props} view="LoginBox" progress={0}/>
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
					props.setLoginView('RestorePortfolio');
					props.setLoginProgress(0.33);
				}}
			/>
			<Button
				primary
				value="Create New Portfolio"
				onClick={() => {
					props.setLoginView('CreatePortfolio');
					props.setLoginProgress(0.25);
				}}
			/>
		</div>
	</div>
);

export default NewPortfolio;
