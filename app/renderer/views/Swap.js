import React from 'react';
import TabView from './TabView';
import './Swap.scss';

class Swap extends React.Component {
	render() {
		return (
			<TabView title="Swap" className="Swap--wrapper">
				<div className="Swap">
					<div className="temp-message">
						<h1>Coming soon…</h1>
						<p>Simple atomic swaps with minimal user interaction</p>
					</div>
				</div>
			</TabView>
		);
	}
}

export default Swap;
