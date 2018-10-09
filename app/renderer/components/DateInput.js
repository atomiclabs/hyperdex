import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import Input from 'components/Input';
import {instance} from '../translate';
import './DateInput.scss';

const WrappedInput = props => {
	const onChange = (value, event) => props.onChange(event);
	return <Input {...props} onChange={onChange}/>;
};

const DateInput = ({forwardedRef, ...props}) => (
	<DayPickerInput
		{...props}
		ref={forwardedRef}
		component={WrappedInput}
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
