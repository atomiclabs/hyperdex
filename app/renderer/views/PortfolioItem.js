import React from 'react';
import ReactDOM from 'react-dom';
import Blockies from 'react-blockies';
import {If} from 'react-extras';
import Button from '../components/Button';
import Input from '../components/Input';

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

		if (portfolio === null) {
			return null; // Not loaded yet
		}

		return (
			<div className="Portfolio">
				<PortfolioImage seed={portfolio.fileName} bgColor="transparent" onClick={this.showLoginInput}/>
				<h4>
					{portfolio.name}
				</h4>
				<If condition={this.state.isLoginInputVisible} render={() => (
					<form className="login-form" onSubmit={this.onSubmit}>
						<div className="form-group">
							<Input
								ref={el => {
									// TODO: Rewrite this to be a controlled component

									if (!el) {
										return;
									}

									// eslint-disable-next-line react/no-find-dom-node
									this.input = ReactDOM.findDOMNode(el).querySelector('input');
								}}
								type="password"
								className="form-control"
								placeholder="Enter Your Password"
								disabled={this.isCheckingPassword}
								autoFocus
								text={this.state.passwordError && this.state.passwordError}
								level={this.state.passwordError && 'danger'}
							/>
						</div>
						<div className="form-group" disabled={this.isCheckingPassword}>
							<Button primary type="submit" value="Login"/>
						</div>
					</form>
				)}/>
			</div>
		);
	}
}

export default PortfolioItem;
