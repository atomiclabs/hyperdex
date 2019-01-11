import React from 'react';
import appContainer from 'containers/App';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import SeedPhrase from 'components/SeedPhrase';
import {translate} from '../../translate';
import './SeedPhraseModal.scss';

const t = translate('settings');

class SeedPhraseModal extends React.Component {
	state = this.initialState;

	passwordInputRef = React.createRef();

	get initialState() {
		return {
			isOpen: false,
			isVerifying: false,
			passwordError: null,
			passwordInputValue: '',
			seedPhrase: '',
		};
	}

	handleOpen = () => {
		this.setState({isOpen: true});
	};

	handleClose = () => {
		this.setState({isOpen: false});
	};

	handleDidClose = () => {
		this.setState(this.initialState);
	}

	handlePasswordInputChange = passwordInputValue => {
		this.setState({passwordInputValue});
	};

	handleSubmit = modalRef => async event => {
		event.preventDefault();

		this.setState({
			isVerifying: true,
			passwordError: null,
		});

		const {passwordInputValue} = this.state;

		try {
			this.setState({
				isVerifying: false,
				seedPhrase: await appContainer.getSeedPhrase(passwordInputValue),
			});

			modalRef.current.focus();
		} catch (error) {
			console.error(error);

			this.setState({
				isVerifying: false,
				passwordInputValue: '',
				passwordError: error.message,
			});

			this.passwordInputRef.current.focus();
		}
	};

	render() {
		return (
			<div className="modal-wrapper">
				<Modal
					className="SeedPhraseModal"
					title={t('seedPhrase.title')}
					open={this.state.isOpen}
					width="470px"
					didClose={this.handleDidClose}
					onClose={this.handleClose}
				>
					{({modalRef}) => this.state.seedPhrase.length > 0 ? (
						<SeedPhrase value={this.state.seedPhrase}/>
					) : (
						<form onSubmit={this.handleSubmit(modalRef)}>
							<div className="form-group">
								<Input
									ref={this.passwordInputRef}
									disabled={this.state.isVerifying}
									errorMessage={this.state.passwordError}
									placeholder={t('seedPhrase.enterPassword')}
									type="password"
									value={this.state.passwordInputValue}
									onChange={this.handlePasswordInputChange}
								/>
							</div>
							<div className="form-group">
								<Button
									fullwidth
									primary
									disabled={this.state.passwordInputValue.length === 0 || this.state.isVerifying}
									type="submit"
									value={t('seedPhrase.submit')}
								/>
							</div>
						</form>
					)}
				</Modal>
				<Button value={t('seedPhrase.title')} onClick={this.handleOpen}/>
			</div>
		);
	}
}

export default SeedPhraseModal;
