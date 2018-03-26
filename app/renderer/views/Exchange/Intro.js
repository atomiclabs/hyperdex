import {remote} from 'electron';
import React from 'react';
import Modal from 'components/Modal';

const config = remote.require('./config');

class Intro extends React.Component {
	state = {
		shouldOpen: !config.get('hasShownExchangeIntro'),
	}

	closedHandler = () => {
		config.set('hasShownExchangeIntro', true);
		setState({shouldOpen: false});
	};

	render() {
		return (
			<div>
				<Modal
					title="How order books work with HyperDEX"
					open={this.state.shouldOpen}
					didClose={this.closedHandler}
				>
					<p>Click on the list to displays all the UXTOs available for the selected price.</p>
					<p>You can think of them as individual sell orders that are waiting to get filled.</p>
					<p>The fastest way to do an Atomic Swap with HyperDEX is by filling exact amounts of the currently available UXTOs.</p>
					<p>Select one from the list for the quickest swap.</p>
				</Modal>
			</div>
		);
	}
}

export default Intro;
