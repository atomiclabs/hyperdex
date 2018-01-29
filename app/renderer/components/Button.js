import styled from 'styled-components';
import {RSButton} from 'reactsymbols-kit';

// See http://docs.reactsymbols.com/#/?id=rsbutton

const Button = styled(RSButton)`
	background: ${props => props.primary ? props.theme.primaryGradient : props.theme.buttonGradient}
`;

export default Button;
