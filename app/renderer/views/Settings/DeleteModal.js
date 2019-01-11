import {remote} from 'electron';
import React from 'react';
import {Trans} from 'react-i18next';
import appContainer from 'containers/App';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import {instance, translate} from '../../translate';

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
	};

	handleNameInputChange = name => {
		this.setState({name});
	};

	render() {
		return (
			<div className="modal-wrapper">
				<Modal
					title={t('deletePortfolio.title')}
					width="445px"
					open={this.state.isOpen}
					onClose={this.handleClose}
				>
					<Trans i18n={instance} i18nKey="deletePortfolio.description" t={t}>
						<p>Unless you save your seed phrase, this action cannot be undone and will permanently delete the <strong>{{name: appContainer.state.portfolio.name}}</strong> portfolio.</p>
						<p>Please type in the name of the portfolio to confirm.</p>
					</Trans>
					<div className="form-group">
						<Input
							value={this.state.name}
							onChange={this.handleNameInputChange}
						/>
					</div>
					<div className="form-group">
						<Button
							fullwidth
							value={t('deletePortfolio.confirm')}
							color="red"
							disabled={this.state.name !== appContainer.state.portfolio.name}
							onClick={this.handleDeleteClick}
						/>
					</div>
				</Modal>
				<Button
					value={t('deletePortfolio.title')}
					color="red"
					onClick={this.handleOpen}
				/>
			</div>
		);
	}
}

export default DeleteModal;
