import React from 'react';
import TabView from './tab-view';

export default class Swap extends React.Component {
	render() {
		return (
			<TabView {...this.props} title="Swap">
				Content
			</TabView>
		);
	}
}
