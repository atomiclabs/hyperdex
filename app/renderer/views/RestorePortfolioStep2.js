import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import LoginBackButton from '../components/LoginBackButton';

const RestorePortfolioStep2 = props => {
	return (
		<div className="RestorePortfolio">
			<LoginBackButton view="RestorePortfolioStep1" progress={0.33}/>
			<h1>Create New Portfolio</h1>
			<form onSubmit={props.handleStep2Submit} style={{marginTop: '20px'}}>
				<div className="form-group">
					<Input
						onChange={props.handlePortfolioNameInputChange}
						placeholder="Portfolio Name"
						value={props.portfolioName}
						autoFocus
						required
						maxLength="50"
						iconName="person"
					/>
				</div>
				<div className="form-group">
					<Input
						onChange={props.handlePortfolioPasswordInputChange}
						type="password"
						placeholder="Password"
						value={props.portfolioPassword}
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
						type="submit"
						value="Next"
						disabled={!(props.portfolioName && props.portfolioPassword && props.confirmedPassword)}
						style={{width: '170px', marginTop: '15px'}}
					/>
				</div>
			</form>
		</div>
	);
};

export default RestorePortfolioStep2;
