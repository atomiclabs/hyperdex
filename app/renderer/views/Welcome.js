import React from 'react';
import Button from '../components/Button';
import './Welcome.scss';

const Welcome = props => (
	<div className="Login container">
		<div className="Welcome is-centered">
			<img className="hyperdex-icon" src="/assets/hyperdex-icon.svg" width="75" height="75"/>
			<h1 style={{marginBottom: '24px'}}>Welcome to HyperDEX!</h1>
			<h2>Would you like to create a new portfolio<br/>or restore an existing one?</h2>
			<p style={{marginTop: '5px'}}>
				{'Create a new one if you don\'t have a seed phrase yet.'}
			</p>
			<div className="action-buttons">
				<Button
					value="Restore"
					onClick={() => {
						props.setLoginView('RestorePortfolio');
					}}
				/>
				<Button
					primary
					value="Create New Portfolio"
					onClick={() => {
						props.setLoginView('CreatePortfolio');
					}}
				/>
			</div>
		</div>
	</div>
);

export default Welcome;
