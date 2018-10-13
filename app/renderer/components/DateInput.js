import React from 'react';
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

const DateInput = ({forwardedRef, ...props}) => (
	<DayPickerInput
		{...props}
		ref={forwardedRef}
		component={WrappedInput}
		format="YYYY-MM-DD"
		formatDate={formatDate}
		parseDate={parseDate}
		dayPickerProps={{
			...props.dayPickerProps,
			locale: instance.language,
			localeUtils: MomentLocaleUtils,
		}}
	/>
);

export default React.forwardRef((props, ref) => (
	<DateInput {...props} forwardedRef={ref}/>
));

export {
	WrappedInput,
};
