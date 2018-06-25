import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {classNames} from 'react-extras';
import CSSTransition from 'react-transition-group/CSSTransition';
import {Manager, Popper, Reference, placements} from 'react-popper';
import './Tooltip.scss';

class Tooltip extends React.PureComponent {
	static propTypes = {
		animationDuration: PropTypes.number,
		children: PropTypes.node,
		content: PropTypes.node,
		margin: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]),
		onClose: PropTypes.func,
		position: PropTypes.oneOf(placements),
	}

	static defaultProps = {
		animationDuration: 300,
		margin: 0,
		position: 'top',
	}

	state = {
		isOpen: false,
	}

	componentWillReceiveProps({content}) {
		if (typeof this.updatePopper === 'function' && this.props.content !== content) {
			this.updatePopper();
		}
	}

	handleMouseEnter = () => {
		this.setState({isOpen: true});
	}

	handleMouseLeave = () => {
		this.setState({isOpen: false});
	}

	render() {
		const {animationDuration, children, content, margin, onClose, position} = this.props;
		const {isOpen} = this.state;
		const tooltip = (
			<Popper placement={position} modifiers={{offset: {offset: `0, ${margin}`}}}>
				{({arrowProps, placement, ref, scheduleUpdate, style}) => {
					this.updatePopper = scheduleUpdate;

					return (
						<div ref={ref} className="Tooltip__container" style={style}>
							<CSSTransition
								classNames="Tooltip"
								in={isOpen}
								mountOnEnter
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
							className="Tooltip__target"
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
