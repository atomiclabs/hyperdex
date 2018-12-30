import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import './TextArea.scss';

class TextArea extends React.Component {
	static propTypes = {
		forwardedRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object,
		]),
		value: PropTypes.string.isRequired,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		level: PropTypes.string,
		message: PropTypes.string,
		errorMessage: PropTypes.string,
		preventNewlines: PropTypes.bool,
		onChange: PropTypes.func,
	}

	static defaultProps = {
		forwardedRef: undefined,
		className: '',
		disabled: false,
		level: undefined,
		message: undefined,
		errorMessage: undefined,
		preventNewlines: false,
		onChange: undefined,
	};

	static getDerivedStateFromProps(props, state) {
		return props.value === state.prevValue ? null : {
			value: props.value,
			prevValue: props.value,
		};
	}

	state = {
		value: this.props.value,
	};

	handleChange = event => {
		const {preventNewlines, onChange} = this.props;
		const {target} = event;
		let {value} = target;

		if (preventNewlines) {
			if (event.nativeEvent.inputType === 'insertLineBreak') {
				const form = target.closest('form');
				if (form) {
					form.dispatchEvent(new Event('submit'));
				}

				return;
			}

			value = value.replace(/\r?\n/g, ' ');
		}

		if (onChange) {
			event.persist();
		}

		this.setState({value}, () => {
			if (onChange) {
				onChange(value, event);
			}
		});
	};

	render() {
		let {
			forwardedRef,
			className,
			level,
			message,
			errorMessage,
			disabled,
			preventNewlines,
			...props
		} = this.props;

		if (errorMessage) {
			level = 'error';
			message = errorMessage;
		}

		const containerClassName = classNames(
			'TextArea',
			'Input',
			{
				[`Input--${level}`]: level,
				'Input--disabled': disabled,
			},
			className
		);

		return (
			<div className={containerClassName}>
				<div className="Input-wrap">
					<textarea
						{...props}
						ref={forwardedRef}
						value={this.state.value}
						disabled={disabled}
						onChange={this.handleChange}
					/>
				</div>
				{((level && message) || message) &&
					<span className="Input__text">
						<p>{message}</p>
					</span>
				}
			</div>
		);
	}
}

export default React.forwardRef((props, ref) => (
	<TextArea {...props} forwardedRef={ref}/>
));
