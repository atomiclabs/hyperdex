import React from 'react';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import './Wallet.scss';

const Wallet = () => {
	return (
		<div className="Dashboard--Wallet">
			<div className="button-wrapper">
				<SendModal/>
				<ReceiveModal/>
			</div>
		</div>
	);
};

export default Wallet;
