import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import LoginBackButton from '../components/LoginBackButton';
import {loginContainer} from '../containers/Login';
import {forgotPasswordContainer as container} from '../containers/ForgotPassword';
import avatar from '../avatar';
import './ForgotPassword.scss';

const ForgotPasswordStep2 = () => {
	const {selectedPortfolio} = loginContainer;
	const {state} = container;

	return (
		<div className="ForgotPassword">
			<LoginBackButton view="ForgotPasswordStep1" progress={0.33}/>
			<h1>Set New Password</h1>
			<form onSubmit={container.handleSubmit} style={{marginTop: '20px'}}>
				<div className="form-group">
					<Input
						className="portfolio-name"
						value={selectedPortfolio.name}
						icon={avatar(selectedPortfolio.id)}
						iconSize={18}
						readOnly
					/>
				</div>
				<div className="form-group">
					<Input
						onChange={container.handlePasswordInputChange}
						type="password"
						placeholder="Password"
						value={state.password}
						autoFocus
						required
					/>
				</div>
				<div className="form-group">
					<Input
						innerRef={input => {
							container.confirmPasswordInput = input;
						}}
						onChange={container.handleConfirmPasswordInputChange}
						type="password"
						placeholder="Confirm Password"
						value={state.confirmedPassword}
						required
						errorMessage={state.confirmedPasswordError}
					/>
				</div>
				<div className="form-group">
					<Button
						primary
						type="submit"
						value="Confirm"
						disabled={!(state.password && state.confirmedPassword)}
						style={{width: '170px', marginTop: '15px'}}
					/>
				</div>
			</form>
		</div>
	);
};

export default ForgotPasswordStep2;
