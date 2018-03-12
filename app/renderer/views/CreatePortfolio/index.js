import React from 'react';
import {Subscribe} from 'unstated';
import LoginView from '../../components/LoginView';
import CreatePortfolioContainer from '../../containers/CreatePortfolio';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const CreatePortfolio = () => (
	<Subscribe to={[CreatePortfolioContainer]}>
		{() => (
			<React.Fragment>
				<LoginView component={Step1}/>
				<LoginView component={Step2}/>
				<LoginView component={Step3}/>
			</React.Fragment>
		)}
	</Subscribe>
);

export default CreatePortfolio;
