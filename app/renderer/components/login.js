import React from 'react';
import {Link} from 'react-router-dom';

/* eslint-disable */

const Portfolio = props => (
	<div className="Portfolio">
		<h4>{props.portfolio.name}</h4>
	</div>
);

const Login = props => {
	const portfolios = props.portfolios.map(portfolio => (
		<Portfolio key={portfolio.fileName} portfolio={portfolio} />
	));

	const portfolioContainer = portfolios ? (
		<div className="portfolios">
			<h1>Select Portfolio to Manage</h1>
			{portfolios}
		</div>
	) : null;

	return (
		<div className="Login container">
			<Link to="/new-portfolio" className="new-portfolio btn btn-lg btn-primary btn-block">Create new portfolio</Link>
			{portfolioContainer}
	  </div>
	);
};

export default Login;
