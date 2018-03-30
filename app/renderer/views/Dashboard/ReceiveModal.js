import React from 'react';
import QRCode from 'qrcode.react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import './ReceiveModal.scss';

const CopyButton = props => (
	<div onClick={props.onClick}>
		<img src="/assets/copy-icon.svg"/>
	</div>
);

class ReceiveModal extends React.Component {
	state = {
		isOpen: false,
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
					className="ReceiveModal"
					title={`Your ${currencyInfo.name} (${currencySymbol}) Wallet Address`}
					open={this.state.isOpen}
					onClose={this.close}
				>
					<React.Fragment>
						<div className="section qrcode">
							<QRCode value={currencyInfo.address}/>
						</div>
						<div className="section">
							<Input readonly className="address-input" value={currencyInfo.address} button={CopyButton}/>
						</div>
						<div className="section">
							<p>Make sure you only send {currencySymbol} to this address.</p>
						</div>
					</React.Fragment>
				</Modal>
				<Button className="OpenModalButton" value="Receive" onClick={this.open}/>
			</div>
		);
	}
}

export default ReceiveModal;
