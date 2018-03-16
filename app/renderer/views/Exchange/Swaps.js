import React from 'react';
import {exchangeContainer} from 'containers/Exchange';
import View from 'components/View';
import {classNames} from 'react-extras';
import './Swaps.scss';

const TabButton = props => (
	<span
		className={
			classNames(
				'button',
				{
					active: exchangeContainer.state.activeSwapsView === props.component.name,
				}
			)
		}
		onClick={() => {
			exchangeContainer.setActiveSwapsView(props.component.name);
		}}
	>
		{props.title}
	</span>
);

const TabView = ({component}) => (
	<View component={component} activeView={exchangeContainer.state.activeSwapsView}/>
);

const Empty = () => (
	<div className="empty">
		<p>No swaps yet</p>
	</div>
);

const All = () => (
	<Empty/>
);

const Split = () => (
	<Empty/>
);

const Swaps = () => {
	const {state} = exchangeContainer;

	return (
		<div className="Exchange--Swaps">
			<header>
				<h3>Swaps</h3>
				<nav>
					<TabButton title="All" component={All}/>
					<TabButton title={`${state.quoteCurrency}/${state.baseCurrency}`} component={Split}/>
				</nav>
			</header>
			<main>
				<TabView component={All}/>
				<TabView component={Split}/>
			</main>
		</div>
	);
};

export default Swaps;
