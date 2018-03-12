import React from 'react';
import {Subscribe} from 'unstated';
import LoginView from '../../components/LoginView';
import RestorePortfolioContainer from '../../containers/RestorePortfolio';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const RestorePortfolio = () => (
	<Subscribe to={[RestorePortfolioContainer]}>
		{() => (
			<React.Fragment>
				<LoginView component={Step1}/>
				<LoginView component={Step2}/>
				<LoginView component={Step3}/>
			</React.Fragment>
		)}
	</Subscribe>
);

export default RestorePortfolio;
