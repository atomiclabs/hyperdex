import React from 'react';
import {Link} from 'react-router-dom';
import Blockies from 'react-blockies';

/* eslint-disable */

const PortfolioImage = props => (
	<div className="PortfolioImage">
		<Blockies
			{...props}
			size={10}
			scale={6}
			bgColor="transparent"
			color="rgba(255,255,255,0.15)"
			spotColor="rgba(255,255,255,0.25)"
		/>
	</div>
);

const Portfolio = ({portfolio}) => (
	<div className="Portfolio">
		<PortfolioImage seed={portfolio.fileName} bgColor="transparent" />
		<h4>{portfolio.name}</h4>
	</div>
);

const Login = props => {
	const portfolios = props.portfolios.map(portfolio => (
		<Portfolio key={portfolio.fileName} portfolio={portfolio} />
	));

	const portfolioContainer = portfolios.length ? (
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
