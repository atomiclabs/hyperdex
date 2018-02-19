import React from 'react';
import ReactSelect from 'react-select';
import './Select.scss';

const Select = props => <ReactSelect {...props} searchable={false} clearable={false}/>;

export default Select;
