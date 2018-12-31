import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.scss';

class Modal extends React.Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node,
		]).isRequired,
		title: PropTypes.node.isRequired,
		icon: PropTypes.string,
		open: PropTypes.bool,
		delay: PropTypes.number,
		width: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]),
		className: PropTypes.string,
		animation: PropTypes.string,
		animationDuration: PropTypes.number,
		closeOnEsc: PropTypes.bool,
		closeOnMaskClick: PropTypes.bool,
		onClose: PropTypes.func,
		didClose: PropTypes.func,
	};

	static defaultProps = {
		icon: undefined,
		open: false,
		delay: 400,
		width: undefined,
		className: '',
		animation: 'slide-up', // `fade`, `slide-up`, `slide-down`, `zoom`
		animationDuration: 300,
		closeOnEsc: true,
		closeOnMaskClick: true,
		onClose: () => {},
		didClose: () => {},
	};

	static getDerivedStateFromProps(props, state) {
		const isClosed = (!state.isOpen || state.animationType === 'close') && !props.open;
		const isOpening = !state.isOpen && props.open;
		const isClosing = state.isOpen && (state.animationType === 'close' || !props.open);

		if (isClosed || (!isClosing && !isOpening)) {
			return null;
		}

		if (isClosing) {
			props.onClose();
		}

		return {
			...isOpening ? {isOpen: true} : {},
			animationType: isOpening ? 'open' : 'close',
		};
	}

	state = {
		isOpen: false,
		animationType: 'close',
	};

	elementRef = React.createRef();

	closeHandler = () => {
		this.props.onClose();
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
			this.props.didClose();
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
						<div className="Modal__close" onClick={this.closeHandler}>
							<div className="Modal__close__icon"/>
						</div>
						{icon &&
							<img className="Modal__icon" src={icon}/>
						}
						<h1>{title}</h1>
					</header>
					<main>
						{typeof children === 'function' ? children({modalRef: this.elementRef}) : children}
					</main>
				</div>
			</div>
		);

		return ReactDOM.createPortal(modal, document.body);
	}
}

export default Modal;
