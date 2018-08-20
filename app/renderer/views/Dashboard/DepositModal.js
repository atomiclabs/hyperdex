import React from 'react';
import QRCode from 'qrcode.react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import CopyCurrencyAddress from 'components/CopyCurrencyAddress';
import dashboardContainer from 'containers/Dashboard';
import {translate} from '../../translate';
import './DepositModal.scss';

const t = translate('dashboard');

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
					title={t('deposit.title', {name: currencyInfo.name, symbol: currencyInfo.symbol})}
					open={this.state.isOpen}
					onClose={this.close}
					width="445px"
				>
					<React.Fragment>
						<div className="section qrcode">
							<QRCode value={currencyInfo.address}/>
						</div>
						<div className="section">
							<CopyCurrencyAddress value={currencyInfo.address}/>
						</div>
						<div className="section infobox">
							<img src="/assets/info-icon.svg" width="26" height="26"/>
							<p>{t('deposit.warning', {symbol: currencyInfo.symbol})}</p>
						</div>
					</React.Fragment>
				</Modal>
				<Button className="OpenModalButton" value={t('deposit.label')} onClick={this.open}/>
			</div>
		);
	}
}

export default DepositModal;
