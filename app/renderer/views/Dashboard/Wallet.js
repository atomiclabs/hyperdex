import React from 'react';
import WithdrawModal from './WithdrawModal';
import DepositModal from './DepositModal';
import './Wallet.scss';

const Wallet = () => {
	return (
		<div className="Dashboard--Wallet">
			<div className="button-wrapper">
				<WithdrawModal/>
				<DepositModal/>
			</div>
		</div>
	);
};

export default Wallet;
