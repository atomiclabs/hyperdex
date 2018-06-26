import React from 'react';
import QRCode from 'qrcode.react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import CopyButton from 'components/CopyButton';
import Input from 'components/Input';
import Tooltip from 'components/Tooltip';
import dashboardContainer from 'containers/Dashboard';
import {withState} from 'containers/SuperContainer';
import {translate} from '../../translate';
import './DepositModal.scss';

const t = translate(['dashboard', 'common']);

const CopyIconButton = withState(
	({setState, state, ...props}) => (
		<Tooltip
			content={state.isCopied ? t('copied') : t('copy')}
			onClose={() => {
				setState({isCopied: false});
			}}
		>
			<CopyButton
				{...props}
				value={dashboardContainer.activeCurrency.address}
				onClick={() => {
					setState({isCopied: true});
				}}
			>
				<img src="/assets/copy-icon.svg"/>
			</CopyButton>
		</Tooltip>
	),
	{isCopied: false}
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
							<Input className="address-input" value={currencyInfo.address} button={CopyIconButton}/>
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
