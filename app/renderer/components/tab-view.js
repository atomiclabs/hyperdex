import React from 'react';

const TabView = props => (
	<React.Fragment>
		<header className="dashhead">
			<div className="dashhead-titles">
				<h6 className="dashhead-subtitle">
					{props.subtitle || props.portfolio.name}
				</h6>
				<h3 className="dashhead-title">
					{props.title}
				</h3>
			</div>
		</header>
		<main>
			{props.children}
		</main>
	</React.Fragment>
);

export default TabView;
