import {remote} from 'electron';
import React from 'react';
import appContainer from 'containers/App';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import {translate} from '../../translate';

const {deletePortfolio} = remote.require('./portfolio-util');
const t = translate('settings');

class DeleteModal extends React.Component {
	state = {
		isOpen: false,
		name: '',
	};

	handleOpen = () => {
		this.setState({isOpen: true});
	};

	handleClose = () => {
		this.setState({isOpen: false});
	};

	handleDeleteClick = () => {
		deletePortfolio(appContainer.state.portfolio.id);
		appContainer.logOut();
	}

	handleNameInputChange = name => {
		this.setState({name});
	}

	render() {
		return (
			<div className="modal-wrapper">
				<Modal title="Delete Portfolio" open={this.state.isOpen} onClose={this.handleClose} width="445px">
					<p>Unless you save your seed phrase, this action cannot be undone and will permanently delete the <strong>{appContainer.state.portfolio.name}</strong> portfolio.</p>
					<p>Please type in the name of the portfolio to confirm.</p>
					<div className="form-group">
						<Input value={this.state.name} onChange={this.handleNameInputChange}/>
					</div>
					<div className="form-group">
						<Button
							fullwidth
							value="I understand, delete this portfolio"
							color="red"
							disabled={this.state.name !== appContainer.state.portfolio.name}
							onClick={this.handleDeleteClick}
						/>
					</div>
				</Modal>
				<Button value={t('deletePortfolio')} color="red" onClick={this.handleOpen}/>
			</div>
		);
	}
}

export default DeleteModal;
