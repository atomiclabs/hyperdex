import React from 'react';
import {Subscribe} from 'unstated';
import LoginView from 'components/LoginView';
import createPortfolioContainer from 'containers/CreatePortfolio';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const CreatePortfolio = () => (
	<Subscribe to={[createPortfolioContainer]}>
		{() => (
			<>
				<LoginView component={Step1}/>
				<LoginView component={Step2}/>
				<LoginView component={Step3}/>
				<LoginView component={Step4}/>
			</>
		)}
	</Subscribe>
);

export default CreatePortfolio;
