import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import LoginBackButton from '../components/LoginBackButton';
import {loginContainer} from '../containers/Login';

const ForgotPasswordStep2 = props => {
	const portfolio = loginContainer.selectedPortfolio;

	// TODO(sindresorhus): Add the identicon to the portfolio field

	return (
		<div className="ForgotPassword">
			<LoginBackButton view="ForgotPasswordStep1" progress={0.33}/>
			<h1>Set New Password</h1>
			<form onSubmit={props.handleSubmit} style={{marginTop: '20px'}}>
				<div className="form-group">
					<Input
						className="portfolio-name"
						value={portfolio.name}
						disabled
					/>
				</div>
				<div className="form-group">
					<Input
						onChange={props.handlePasswordInputChange}
						type="password"
						placeholder="Password"
						value={props.password}
						autoFocus
						required
					/>
				</div>
				<div className="form-group">
					<Input
						innerRef={props.setConfirmPasswordInput}
						onChange={props.handleConfirmPasswordInputChange}
						type="password"
						placeholder="Confirm Password"
						value={props.confirmedPassword}
						required
						errorMessage={props.confirmedPasswordError}
					/>
				</div>
				<div className="form-group">
					<Button
						primary
						type="submit"
						value="Confirm"
						disabled={!(props.password && props.confirmedPassword)}
						style={{width: '170px', marginTop: '15px'}}
					/>
				</div>
			</form>
		</div>
	);
};

export default ForgotPasswordStep2;
