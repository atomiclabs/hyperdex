import React from 'react';
import TabView from './TabView';

export default class Swap extends React.Component {
	render() {
		return (
			<TabView {...this.props} title="Swap">
				Content
			</TabView>
		);
	}
}
