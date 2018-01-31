import React from 'react';
import globalState from '../global-state';
import Nav from './Nav';

const TabView = props => (
	<div className="Main">
		<div className="with-iconav">
			<Nav {...props}/>

			<div className="container">
				<header className="dashhead">
					<div className="dashhead-titles">
						<h6 className="dashhead-subtitle">
							{props.subtitle || globalState.get().portfolio.name}
						</h6>
						<h3 className="dashhead-title">
							{props.title}
						</h3>
					</div>
				</header>
				<main>
					{props.children}
				</main>
			</div>
		</div>
	</div>
);

export default TabView;
