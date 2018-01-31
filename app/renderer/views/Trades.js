import React from 'react';
import TabView from './TabView';

export default class Trades extends React.Component {
	render() {
		return (
			<TabView {...this.props} title="Trades">
				Content
			</TabView>
		);
	}
}
