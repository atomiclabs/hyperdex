import React from 'react';
import roundTo from 'round-to';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import './WithdrawModal.scss';

class WithdrawModal extends React.Component {
	state = {
		isOpen: false,
		recepientAddress: '',
		amount: 0,
	};

	open = () => {
		this.setState({isOpen: true});
	};

	close = () => {
		this.setState({isOpen: false});
	};

	render() {
		const currencySymbol = dashboardContainer.state.activeView;
		const currencyInfo = appContainer.getCurrency(currencySymbol);

		return (
			<div className="modal-wrapper">
				<Modal
					className="WithdrawModal"
					title={`Withdraw ${currencyInfo.name} (${currencySymbol})`}
					open={this.state.isOpen}
					onClose={this.close}
				>
					<React.Fragment>
						<div className="section">
							<label>Recepient:</label>
							<Input
								required
								value={this.state.recepientAddress}
								placeholder={`Enter ${currencySymbol} Address`}
								onChange={value => {
									this.setState({recepientAddress: value});
								}}
							/>
						</div>
						<div className="section">
							<label>Amount {currencySymbol}:</label>
							<Input
								value={roundTo(this.state.amount, 8)}
								type="number"
								min="0"
								step="any"
								required
								onChange={value => {
									this.setState({amount: Number.parseFloat(value)});
								}}
							/>
							<label>Amount USD:</label>
							<Input
								value={roundTo(this.state.amount * currencyInfo.cmcPriceUsd, 8)}
								type="number"
								min="0"
								step="any"
								required
								onChange={value => {
									this.setState({amount: Number.parseFloat(value) / currencyInfo.cmcPriceUsd});
								}}
							/>
						</div>
						<Button className="withdraw-button" primary value="Withdraw"/>
					</React.Fragment>
				</Modal>
				<Button className="OpenModalButton" value="Withdraw" onClick={this.open}/>
			</div>
		);
	}
}

export default WithdrawModal;
