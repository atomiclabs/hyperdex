import React from 'react';
import Blockies from 'react-blockies';
import {If} from 'react-extras';

const PortfolioImage = ({onClick, ...rest}) => (
	<div className="PortfolioImage" onClick={onClick}>
		<Blockies
			{...rest}
			size={10}
			scale={6}
			bgColor="transparent"
			color="rgba(255,255,255,0.15)"
			spotColor="rgba(255,255,255,0.25)"
		/>
	</div>
);

class PortfolioItem extends React.Component {
	state = {
		isLoginInputVisible: this.props.showLoginForm,
		isCheckingPassword: false,
	};

	showLoginInput = () => {
		this.setState({
			isLoginInputVisible: true,
		});
	};

	onSubmit = async event => {
		event.preventDefault();

		this.setState({isCheckingPassword: true});

		const {portfolio, handleLogin} = this.props;
		const password = this.input.value;

		try {
			await handleLogin(portfolio, password);
		} catch (err) {
			console.error(err);

			this.input.value = '';

			const passwordError = /Authentication failed/.test(err.message) ? 'Incorrect password' : err.message;
			this.setState({
				isCheckingPassword: false,
				passwordError,
			});
		}
	};

	render() {
		const {portfolio} = this.props;

		return (
			<div className="Portfolio">
				<PortfolioImage seed={portfolio.fileName} bgColor="transparent" onClick={this.showLoginInput}/>
				<h4>
					{portfolio.name}
				</h4>
				<If condition={this.state.isLoginInputVisible} render={() => (
					<form className="login-form" onSubmit={this.onSubmit}>
						<div className="form-group">
							<input
								ref={input => {
									this.input = input;
								}}
								type="password"
								className="form-control"
								placeholder="Enter Your Password"
								disabled={this.isCheckingPassword}
								autoFocus
							/>
						</div>
						<div className="form-group" disabled={this.isCheckingPassword}>
							<button type="submit" className="btn btn-primary btn-sm btn-block">
								Login
							</button>
						</div>
						<If condition={Boolean(this.state.passwordError)} render={() => (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									{this.state.passwordError}
								</div>
							</div>
						)}/>
					</form>
				)}/>
			</div>
		);
	}
}

export default PortfolioItem;
