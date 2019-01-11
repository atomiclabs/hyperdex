import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import CopyCurrencyAddress from 'components/CopyCurrencyAddress';
import {translate} from '../translate';
import './DonateButton.scss';

const t = translate('app');

const donationAddresses = {
	kmd: 'RHyper8TJyHK6uZ3AXzUwC2uVRdt7cfxEC',
	btc: '1HyperDEXfMx459ZFh6Ram5uymS8AiRAQf',
};

class DonateButton extends React.Component {
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
		return (
			<>
				<Modal
					className="DonateModal"
					title={`${t('donate.title')} ❤️`}
					open={this.state.isOpen}
					width="500px"
					onClose={this.close}
				>
					<>
						<div className="section text">
							<p>{t('donate.bodyText')}</p>
						</div>
						<div className="section">
							<label>KMD:</label>
							<CopyCurrencyAddress value={donationAddresses.kmd}/>
						</div>
						<div className="section">
							<label>BTC:</label>
							<CopyCurrencyAddress value={donationAddresses.btc}/>
						</div>
					</>
				</Modal>
				<Button
					className="DonateButton"
					value={t('donate.title')}
					onClick={this.open}
				/>
			</>
		);
	}
}

export default DonateButton;
