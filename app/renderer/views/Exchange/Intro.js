import {remote} from 'electron';
import React from 'react';
import Modal from 'components/Modal';
import ExternalLink from 'components/ExternalLink';

const config = remote.require('./config');

class Intro extends React.Component {
	state = {
		shouldOpen: !config.get('hasShownExchangeIntro'),
	}

	closedHandler = () => {
		config.set('hasShownExchangeIntro', true);
		this.setState({shouldOpen: false});
	};

	render() {
		return (
			<div>
				<Modal
					title="How Trading Works with HyperDEX"
					open={this.state.shouldOpen}
					didClose={this.closedHandler}
					width="500px"
				>
					<p>HyperDEX is a decentralized exchange. It has a P2P order book and trades are made via <ExternalLink url="https://en.bitcoin.it/wiki/Atomic_cross-chain_trading">cross-chain atomic swaps</ExternalLink>. This means it works slightly differently than a centralized exchange.</p>
					<p>Orders can take a while to propagate across the P2P network. You may need to wait a while for the order book to display.</p>
					<p>HyperDEX needs you to have correctly sized <ExternalLink url="https://bitcoin.stackexchange.com/a/61579">UTXOs</ExternalLink> to make a successful swap. For each UTXO you can make a single swap. The easiest way to ensure you can participate in a swap is to make two or three smaller deposits to your account rather than a single large deposit.</p>
					<p>An atomic swap is comprised of six on-chain transactions. When trading a currency with high transaction fees, it&apos;s important to slightly increase your price to account for the total transaction fees. This is especially important when trading small amounts.</p>
				</Modal>
			</div>
		);
	}
}

export default Intro;
