import React from 'react';
import {RSSelect} from 'reactsymbols-kit';
import './Select.scss';

// See: http://docs.reactsymbols.com/#/?id=rsselect

const Select = props => <RSSelect {...props} searchable={false} clearable={false}/>;

export default Select;
