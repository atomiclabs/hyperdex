import React from 'react';
import Modal from 'components/Modal';
import './SwapDetails.scss';

class SwapDetails extends React.Component {
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
			<div className="modal-wrapper">
				<Modal
					className="SwapDetails"
					title="Swap Details"
					open={this.state.isOpen}
					onClose={this.close}
				>
					<React.Fragment>
						<div className="section">
							Not yet implemented
						</div>
					</React.Fragment>
				</Modal>
				<button type="button" className="view__button" onClick={this.open}>View</button>
			</div>
		);
	}
}

export default SwapDetails;
