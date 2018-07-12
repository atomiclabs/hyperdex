import React from 'react';
import appContainer from 'containers/App';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import WrapWidth from 'components/WrapWidth';
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

	handleSubmit = async event => {
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
		} catch (err) {
			console.error(err);

			this.setState({
				isVerifying: false,
				passwordInputValue: '',
				passwordError: err.message,
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
					onClose={this.handleClose}
					didClose={this.handleDidClose}
					width="445px"
				>
					{this.state.seedPhrase.length > 0 ? (
						<div className="seed-phrase">
							<WrapWidth wordsPerLine={6}>
								{this.state.seedPhrase}
							</WrapWidth>
						</div>
					) : (
						<form onSubmit={this.handleSubmit}>
							<div className="form-group">
								<Input
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
									disabled={this.state.passwordInputValue.length === 0 || this.state.isVerifying}
									fullwidth
									primary
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
