import React from 'react';

/* eslint-disable */

const TabView = props => (
	<div>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h6 className="dashhead-subtitle">{props.subtitle || props.portfolio.name}</h6>
				<h3 className="dashhead-title">{props.title}</h3>
			</div>
		</header>
		<main>
			{props.children}
		</main>
	</div>
);

export default TabView;
