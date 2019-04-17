import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {classNames} from 'react-extras';
import {Manager, Popper, Reference, placements} from 'react-popper';
import CSSTransition from 'react-transition-group/CSSTransition';
import './Tooltip.scss';

class Tooltip extends React.PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		content: PropTypes.node.isRequired,
		animationDuration: PropTypes.number,
		margin: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]),
		position: PropTypes.oneOf(placements),
		onClose: PropTypes.func,
	}

	static defaultProps = {
		animationDuration: 300,
		margin: 0,
		position: 'top',
		onClose: undefined,
	}

	state = {
		isOpen: false,
	}

	handleMouseEnter = () => {
		this.setState({isOpen: true});
	}

	handleMouseLeave = () => {
		this.setState({isOpen: false});
	}

	render() {
		const {
			children,
			content,
			animationDuration,
			margin,
			position,
			onClose,
		} = this.props;

		const {isOpen} = this.state;

		if (typeof this.updatePopper === 'function') {
			this.updatePopper();
		}

		const tooltip = (
			<Popper placement={position} modifiers={{offset: {offset: `0, ${margin}`}}}>
				{({arrowProps, placement, ref, scheduleUpdate, style}) => {
					this.updatePopper = scheduleUpdate;

					return (
						<div ref={ref} className="Tooltip__container" style={style}>
							<CSSTransition
								mountOnEnter
								classNames="Tooltip"
								in={isOpen}
								timeout={{
									enter: 0, // Start animation immediately
									exit: animationDuration,
								}}
								onExited={onClose}
							>
								<div
									className={classNames(
										'Tooltip',
										`Tooltip--${placement}`,
									)}
								>
									<div className="Tooltip__content">
										{content}
									</div>
									<div
										ref={arrowProps.ref}
										className="Tooltip__arrow"
										style={arrowProps.style}
									/>
								</div>
							</CSSTransition>
							<style jsx>
								{`
									.Tooltip {
										transition-duration: ${animationDuration}ms;
									}
								`}
							</style>
						</div>
					);
				}}
			</Popper>
		);

		return (
			<Manager>
				<Reference>
					{({ref}) => (
						<div
							ref={ref}
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}
						>
							{children}
						</div>
					)}
				</Reference>
				{ReactDOM.createPortal(tooltip, document.body)}
			</Manager>
		);
	}
}

export default Tooltip;
