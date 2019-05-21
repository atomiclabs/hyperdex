import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import propTypesRange from 'prop-types-range';
import _ from 'lodash';
import './Input.scss';

const stripLeadingZeros = string => string.replace(/^0+(?=\d)/, '');

const fractionCount = string => {
	const match = /\d+\.(\d+)$/.exec(string);
	return match ? match[1].length : 0;
};

const truncateFractions = (value, maximumFractionDigits) => Number.parseFloat(value).toLocaleString('fullwide', {
	maximumFractionDigits,
	useGrouping: false,
});

const isExponentialNotation = value => /(\d+\.?\d*)e\d*(\+|-)(\d+)/.test(value);

class Input extends React.Component {
	static propTypes = {
		forwardedRef: PropTypes.oneOfType([
			PropTypes.elementType,
			PropTypes.object,
		]),
		className: PropTypes.string,
		type: PropTypes.string,
		level: PropTypes.string,
		icon: PropTypes.string,
		iconSize: PropTypes.number,
		iconName: PropTypes.string,
		message: PropTypes.string,
		errorMessage: PropTypes.string,
		disabled: PropTypes.bool,
		readOnly: PropTypes.bool,
		onlyNumeric: PropTypes.bool,
		fractionalDigits: propTypesRange(0, 20),
		view: PropTypes.elementType,
		button: PropTypes.elementType,
		onChange: PropTypes.func,
		value: PropTypes.string,
		pattern: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
	}

	static defaultProps = {
		forwardedRef: undefined,
		className: '',
		type: 'text',
		level: undefined,
		icon: undefined,
		iconSize: undefined,
		iconName: undefined,
		message: undefined,
		errorMessage: undefined,
		disabled: false,
		readOnly: false,
		onlyNumeric: false,
		fractionalDigits: undefined,
		view: undefined,
		button: undefined,
		onChange: undefined,
		value: '',
		pattern: undefined,
	}

	static getDerivedStateFromProps(props, state) {
		const isValueChanged = props.value !== state.prevValue;
		const isLevelChanged = props.level !== state.prevLevel;

		if (!isValueChanged && !isLevelChanged) {
			return null;
		}

		return {
			...isValueChanged && {
				value: props.value,
				prevValue: props.value,
			},
			...isLevelChanged && {
				level: props.level,
				prevLevel: props.level,
			},
		};
	}

	state = {
		level: this.props.level,
		value: this.props.value,
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

		this._checkValidity(event);

		this.setState({value}, () => {
			if (onChange) {
				onChange(value, event);
			}
		});
	};

	_checkValidity = _.debounce(event => {
		const {pattern} = this.props;
		const {value} = event.target;
		const isValid = typeof pattern === 'function' ? (!value || pattern(value)) : event.target.checkValidity();

		this.setState({level: isValid ? null : 'error'});
	}, 500);

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

	render() {
		let {
			forwardedRef,
			className,
			type,
			icon,
			iconSize,
			iconName,
			message,
			errorMessage,
			disabled,
			readOnly,
			onlyNumeric,
			fractionalDigits,
			pattern,
			view: View,
			button: Button,
			onChange,
			...props
		} = this.props;
		let {level} = this.state;

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

		if (typeof pattern === 'function') {
			pattern = null;
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
			if (isExponentialNotation(value)) {
				value = truncateFractions(value, 20); // 20 is the maximum, we truncate below instead
			}

			if (this._shouldTruncateFractions(value)) {
				value = truncateFractions(value, fractionalDigits);
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
						pattern={pattern}
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
