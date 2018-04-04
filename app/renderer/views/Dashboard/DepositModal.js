import {clipboard} from 'electron';
import React from 'react';
import QRCode from 'qrcode.react'; // eslint-disable-line import/extensions
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import './DepositModal.scss';

const CopyButton = props => (
	<div
		{...props}
		onClick={() => {
			// TODO: DRY this up
			const currencySymbol = dashboardContainer.state.activeView;
			clipboard.writeText(appContainer.getCurrency(currencySymbol).address);
		}}
	>
		<img src="/assets/copy-icon.svg"/>
	</div>
);

class DepositModal extends React.Component {
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
		const currencyInfo = dashboardContainer.activeCurrency;

		return (
			<div className="modal-wrapper">
				<Modal
					className="DepositModal"
					title={`Your ${currencyInfo.name} (${currencyInfo.symbol}) Wallet Address`}
					open={this.state.isOpen}
					onClose={this.close}
				>
					<React.Fragment>
						<div className="section qrcode">
							<QRCode value={currencyInfo.address}/>
						</div>
						<div className="section">
							<Input className="address-input" value={currencyInfo.address} button={CopyButton}/>
						</div>
						<div className="section">
							<p>Make sure you only send {currencyInfo.symbol} to this address.</p>
						</div>
					</React.Fragment>
				</Modal>
				<Button className="OpenModalButton" value="Deposit" onClick={this.open}/>
			</div>
		);
	}
}

export default DepositModal;
