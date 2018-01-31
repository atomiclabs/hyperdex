import React from 'react';
import TabView from './tab-view';

export default class Exchange extends React.Component {
	render() {
		return (
			<TabView {...this.props} title="Exchange">
				Content
			</TabView>
		);
	}
}
