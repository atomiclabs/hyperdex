import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

class Modal extends React.Component {
	static defaultProps = {
		animation: 'slide-up', // `fade`, `slide-up`, `slide-down`, `zoom`
		animationDuration: 400,
		closeOnEsc: true,
		closeOnMaskClick: true,
		delay: 400,
	};

	state = {
		isOpen: false,
		animationType: 'close',
	};

	elementRef = React.createRef();

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

	animationEnd = async event => {
		const element = this.elementRef.current;

		// Prevent event triggered by the dialog animation
		if (event.currentTarget !== element) {
			return;
		}

		if (this.state.animationType === 'close') {
			await this.setState({isOpen: false});

			const {didClose} = this.props;
			if (didClose) {
				didClose();
			}
		} else {
			if (this.props.closeOnEsc) {
				element.focus();
			}

			// Focus the first input if the modal has any
			const input = element.querySelector('input');
			if (input) {
				input.focus();
			}
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
			icon,
			className,
			width,
			animation,
			animationDuration,
			closeOnEsc,
			closeOnMaskClick,
			onClose, // Useful if you want to handle closing it yourself
			didClose, // Useful to get notified when the modal finished closing
			...props
		} = this.props;

		const modal = (
			<div
				ref={this.elementRef}
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
						width,
					}}
				>
					<header>
						<span className="Modal__close" onClick={this.closeHandler}/>
						{icon &&
							<img className="Modal__icon" src={icon}/>
						}
						<h1>{title}</h1>
					</header>
					<main>
						{children}
					</main>
				</div>
			</div>
		);

		return ReactDOM.createPortal(modal, document.body);
	}
}

export default Modal;
