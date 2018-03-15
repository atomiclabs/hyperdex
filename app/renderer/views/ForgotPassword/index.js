import React from 'react';
import {Subscribe} from 'unstated';
import LoginView from 'components/LoginView';
import ForgotPasswordContainer from 'containers/ForgotPassword';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const ForgotPassword = () => (
	<Subscribe to={[ForgotPasswordContainer]}>
		{() => (
			<React.Fragment>
				<LoginView component={Step1}/>
				<LoginView component={Step2}/>
				<LoginView component={Step3}/>
			</React.Fragment>
		)}
	</Subscribe>
);

export default ForgotPassword;
