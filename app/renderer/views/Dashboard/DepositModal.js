import React from 'react';
import QRCode from 'qrcode.react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import CopyButton from 'components/CopyButton';
import Input from 'components/Input';
import dashboardContainer from 'containers/Dashboard';
import './DepositModal.scss';

const CopyIconButton = props => (
	<CopyButton {...props} value={dashboardContainer.activeCurrency.address}>
		<img src="/assets/copy-icon.svg"/>
	</CopyButton>
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
					width="445px"
				>
					<React.Fragment>
						<div className="section qrcode">
							<QRCode value={currencyInfo.address}/>
						</div>
						<div className="section">
							<Input className="address-input" value={currencyInfo.address} button={CopyIconButton}/>
						</div>
						<div className="section infobox">
							<img src="/assets/info-icon.svg" width="26" height="26"/>
							<p>Make sure you only send {currencyInfo.symbol} to this address</p>
						</div>
					</React.Fragment>
				</Modal>
				<Button className="OpenModalButton" value="Deposit" onClick={this.open}/>
			</div>
		);
	}
}

export default DepositModal;
