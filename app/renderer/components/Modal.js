import React from 'react';
import './Modal.scss';

class Modal extends React.Component {
	static defaultProps = {
		animation: 'slide-up', // `fade`, `slide-up`, `slide-down`, `zoom`
		animationDuration: 400,
		closeOnEsc: true,
		closeOnMaskClick: false,
		delay: 400,
	};

	state = {
		isOpen: false,
		animationType: 'close',
	};

	openHandler = () => {
		this.setState({
			isOpen: true,
			animationType: 'open',
		});
	};

	closeHandler = () => {
		if (this.props.onClose) {
			this.props.onClose();
		}

		this.setState({animationType: 'close'});
	};

	onKeyUp = event => {
		if (this.props.closeOnEsc && event.key === 'Escape') {
			this.closeHandler();
		}
	}

	animationEnd = event => {
		// Prevent event triggered by the dialog animation
		if (event.currentTarget !== this.element) {
			return;
		}

		if (this.state.animationType === 'close') {
			this.setState({isOpen: false}, () => {
				const {didClose} = this.props;
				if (didClose) {
					didClose();
				}
			});
		} else if (this.props.closeOnEsc) {
			this.element.focus();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.open && nextProps.open) {
			this.openHandler();
		} else if (this.props.open && !nextProps.open) {
			this.closeHandler();
		}
	}

	componentDidMount() {
		if (this.props.open) {
			setTimeout(() => {
				this.setState({
					isOpen: true,
					animationType: 'open',
				});
			}, this.props.delay);
		}
	}

	render() {
		const {state} = this;
		const {
			children,
			title,
			className,
			animation,
			animationDuration,
			closeOnEsc,
			closeOnMaskClick,
			onClose, // Useful if you want to handle closing it yourself
			didClose, // Useful to get notified when the modal finished closing
			...props
		} = this.props;

		return (
			<div
				ref={element => {
					this.element = element;
				}}
				className={`Modal Modal-fade-${state.animationType} ${className}`}
				style={{
					display: state.isOpen ? '' : 'none',
					animationDuration: `${animationDuration}ms`,
				}}
				tabIndex="-1"
				onKeyUp={this.onKeyUp}
				onAnimationEnd={this.animationEnd}
			>
				<div className="Modal__mask" onClick={closeOnMaskClick ? this.closeHandler : null}/>
				<div
					{...props}
					className={`Modal__dialog Modal-${animation}-${state.animationType}`}
					style={{
						animationDuration: `${animationDuration}ms`,
					}}
				>
					<header>
						<span className="Modal__close" onClick={this.closeHandler}/>
						<h1>{title}</h1>
					</header>
					<main>
						{children}
					</main>
				</div>
			</div>
		);
	}
}

export default Modal;
