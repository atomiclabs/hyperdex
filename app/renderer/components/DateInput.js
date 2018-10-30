import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import Input from 'components/Input';
import {instance} from '../translate';
import './DateInput.scss';

const WrappedInput = React.forwardRef((props, ref) => {
	const onChange = (value, event) => props.onChange(event);
	return <Input {...props} ref={ref} pattern="(\d{1,4}){1}(-\d{1,2}){0,1}(-\d{0,2}){0,1}" onChange={onChange}/>;
});

class DateInput extends React.Component {
	static propTypes = {
		autoCorrect: PropTypes.bool,
		forwardedRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object,
		]),
		onDayChange: PropTypes.func,
	}

	state = {
		hasError: false,
		isInvalid: false,
		value: this.props.value,
	};

	handleBlur = event => {
		const {autoCorrect, forwardedRef, onBlur, onDayChange} = this.props;
		const {value} = this.state;

		if (autoCorrect && this.state.isInvalid) {
			this.setState({hasError: true});

			setTimeout(() => {
				onDayChange(value, {}, forwardedRef.current);
			}, 1000);
		}

		if (typeof onBlur === 'function') {
			onBlur(event);
		}
	}

	handleDayChange = (day, modifiers, input) => {
		const {onDayChange} = this.props;
		const isInvalid = modifiers.disabled || !day;

		this.setState(state => ({
			hasError: false,
			isInvalid,
			value: isInvalid ? state.value : day,
		}), () => {
			onDayChange(day, modifiers, input);
		});
	};

	render() {
		const {forwardedRef, ...props} = this.props;
		const {hasError} = this.state;

		return (
			<DayPickerInput
				{...props}
				ref={forwardedRef}
				component={WrappedInput}
				format="YYYY-MM-DD"
				formatDate={formatDate}
				onDayChange={this.handleDayChange}
				parseDate={parseDate}
				dayPickerProps={{
					...props.dayPickerProps,
					locale: instance.language,
					localeUtils: MomentLocaleUtils,
				}}
				inputProps={{
					className: hasError ? 'shake-animation' : '',
					onBlur: this.handleBlur,
				}}
			/>
		);
	}
}

export default React.forwardRef((props, ref = React.createRef()) => (
	<DateInput {...props} forwardedRef={ref}/>
));

export {
	WrappedInput,
};
