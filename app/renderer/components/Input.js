import React from 'react';
import styled from 'styled-components';
import {RSInput} from 'reactsymbols-kit';

// See http://docs.reactsymbols.com/#/?id=rsinput

const Input = styled(props => (
	<RSInput {...props} iconSize="16"/>
))`
	background: #222C3C !important;
	color: pink;
`;

export default Input;
