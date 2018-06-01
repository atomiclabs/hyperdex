import React from 'react';
import {classNames} from 'react-extras';
import './Input.scss';

const stripLeadingZeros = string => string.replace(/^0+(?=\d)/, '');

const fractionCount = string => {
	const match = /\d+\.(\d+)$/.exec(string);
	return match ? match[1].length : 0;
};

class Input extends React.Component {
	state = {
		value: this.props.value || '',
	};

	handleChange = event => {
		let {value} = event.target;
		const {onlyNumeric, onChange} = this.props;

		if (onlyNumeric) {
			if (Number.isNaN(Number(value))) {
				return;
			}

			value = stripLeadingZeros(value);

			if (this._shouldTruncateFractions(value)) {
				return;
			}
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

	_shouldTruncateFractions(value) {
		const {fractionalDigits} = this.props;

		if (typeof fractionalDigits === 'undefined') {
			return false;
		}

		return value !== '' && !/^\d+\.0*$/.test(value) && fractionCount(value) > fractionalDigits;
	}

	_truncateZeroOnlyFractions(value) {
		const {fractionalDigits} = this.props;

		if (typeof fractionalDigits === 'undefined') {
			return value;
		}

		// Special case for handling `0.00000000` with fractions longer than `fractionalDigits`
		const [number, fraction] = (value || '').split('.');
		if (/^0+$/.test(fraction) && fraction.length > fractionalDigits) {
			value = `${number}.${'0'.repeat(fractionalDigits)}`;
		}

		return value;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.state.value) {
			this.setState({value: nextProps.value});
		}
	}

	render() {
		let {
			forwardedRef,
			className,
			level,
			message,
			errorMessage,
			disabled,
			readOnly,
			onChange,
			onlyNumeric,
			fractionalDigits,
			type = 'text',
			icon,
			iconSize,
			iconName,
			view: View,
			button: Button,
			...props
		} = this.props;

		if (errorMessage) {
			level = 'error';
			message = errorMessage;
		}

		if (type === 'password') {
			iconName = 'password';
		}

		if (iconName) {
			icon = `/assets/${iconName}-icon.svg`;
		}

		const containerClassName = classNames(
			'Input',
			{
				[`Input--${level}`]: level,
				'Input--disabled': disabled,
				'Input--readonly': readOnly,
				'Input--icon': icon,
				'Input--view': View || Button,
			},
			className
		);

		let {value} = this.state;

		if (typeof value !== 'string') {
			throw new TypeError(`Expected \`value\` to be a string, got ${typeof value}`);
		}

		if (onlyNumeric) {
			if (this._shouldTruncateFractions(value)) {
				value = Number.parseFloat(value).toFixed(fractionalDigits);
			}
			value = this._truncateZeroOnlyFractions(value);
		}

		return (
			<div className={containerClassName}>
				<div className="Input-wrap">
					<input
						{...props}
						ref={forwardedRef}
						value={value}
						type={type}
						disabled={disabled}
						readOnly={readOnly}
						onChange={this.handleChange}
					/>
					{icon &&
						<span className="Input__icon">
							<img src={icon} width={iconSize}/>
						</span>
					}
					{View &&
						<span className="Input__view">
							<View/>
						</span>
					}
					{Button &&
						<span className="Input__view Input__button">
							<Button/>
						</span>
					}
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
	<Input {...props} forwardedRef={ref}/>
));
