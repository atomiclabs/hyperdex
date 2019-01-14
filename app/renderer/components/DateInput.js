import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import MomentLocaleUtils, {formatDate, parseDate} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import Input from 'components/Input';
import {instance} from '../translate';
import {setInputValue} from '../util';
import './DateInput.scss';

const WrappedInput = React.forwardRef((props, ref) => {
	const onChange = (value, event) => props.onChange(event);
	const validateInput = value => moment(value).isValid();

	return <Input {...props} ref={ref} pattern={validateInput} onChange={onChange}/>;
});

WrappedInput.propTypes = {
	onChange: PropTypes.func,
};

WrappedInput.defaultProps = {
	onChange: () => {},
};

class DateInput extends React.Component {
	static propTypes = {
		forwardedRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object,
		]),
		autoCorrect: PropTypes.bool,
		onDayChange: PropTypes.func,
		onBlur: PropTypes.func,
		inputProps: PropTypes.object,
		dayPickerProps: PropTypes.object.isRequired,
		value: PropTypes.any.isRequired, // TODO: Validate it as a `Date`. PropTypes doesn't have support for that.
	}

	static defaultProps = {
		forwardedRef: undefined,
		autoCorrect: false,
		onDayChange: () => {},
		onBlur: () => {},
		inputProps: undefined,
	};

	constructor(props) {
		super(props);
		this.inputRef = this.props.forwardedRef || React.createRef();
		this.state = {
			hasError: false,
			isInvalid: false,
			value: this.props.value,
		};
	}

	handleBlur = event => {
		const {autoCorrect, onBlur} = this.props;
		const {value} = this.state;

		if (autoCorrect && this.state.isInvalid) {
			this.setState({hasError: true});

			setTimeout(() => {
				const {dayPickerProps, format, formatDate} = this.inputRef.current.props;
				setInputValue(event.target, formatDate(value, format, dayPickerProps.locale));
			}, 600);
		}

		onBlur(event);
	}

	handleDayChange = (day, modifiers, input) => {
		const {onDayChange} = this.props;
		const inputValue = input.getInput().value;
		const isInvalid = modifiers.disabled || (!day && inputValue);

		this.setState(state => ({
			hasError: false,
			isInvalid,
			value: isInvalid ? state.value : day,
		}), () => {
			onDayChange(day, modifiers, input);
		});
	};

	render() {
		const {hasError} = this.state;

		return (
			<DayPickerInput
				{...this.props}
				ref={this.inputRef}
				component={WrappedInput}
				format="YYYY-MM-DD"
				formatDate={formatDate}
				parseDate={parseDate}
				dayPickerProps={{
					...this.props.dayPickerProps,
					locale: instance.language,
					localeUtils: MomentLocaleUtils,
				}}
				inputProps={{
					...this.props.inputProps,
					className: hasError ? 'shake-animation' : '',
					onBlur: this.handleBlur,
				}}
				onDayChange={this.handleDayChange}
			/>
		);
	}
}

export default React.forwardRef((props, ref) => (
	<DateInput {...props} forwardedRef={ref}/>
));

export {
	WrappedInput,
};
