import electron from 'electron';
import React from 'react';
import {If} from 'react-extras';

/* eslint-disable */

const {createPortfolio} = electron.remote.require('./portfolio-util');

class CreatePortfolioButton extends React.Component {
	state = {
		showPortfolioForm: false
	};

	showPortfolioForm = () => {
		this.setState({showPortfolioForm: true});
	};

	hidePortfolioForm = () => {
		this.setState({showPortfolioForm: false});
	};

	onSubmit = async event => {
		event.preventDefault();
		this.hidePortfolioForm();
		await createPortfolio(this.state);
		this.props.loadPortfolios();
	};

	render() {
		return (
			<div>
				<button className="add-portfolio btn btn-sm btn-primary btn-block" onClick={this.showPortfolioForm} disabled={this.state.showPortfolioForm}>Add portfolio</button>
				<If condition={this.state.showPortfolioForm} render={() => (
					<div className="add-portfolio-modal modal-dialog">
						<div className="modal-content">
							<form className="portfolio-form" onSubmit={this.onSubmit}>
								<div className="modal-header">
									<h5 className="modal-title">Add portfolio</h5>
									<button type="button" className="close" onClick={this.hidePortfolioForm}>
										<span>&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											placeholder="Portfolio Name"
											onChange={e => this.setState({ name: e.target.value })}
											autoFocus
										/>
									</div>
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											placeholder="Seed Phrase"
											onChange={e => this.setState({ seedPhrase: e.target.value })}
										/>
									</div>
									<div className="form-group">
										<input
											type="password"
											className="form-control"
											placeholder="Password"
											onChange={e => this.setState({ password: e.target.value })}
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button type="submit" className="btn btn-primary">Add</button>
									<button type="button" className="btn btn-secondary" onClick={this.hidePortfolioForm}>Close</button>
								</div>
							</form>
						</div>
					</div>
				)}/>
			</div>
		);
	}
}

export default CreatePortfolioButton;
