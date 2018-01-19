import React from 'react';
import TabView from './tab-view';

/* eslint-disable */

export default class Exchange extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TabView {...this.props} title="Exchange">
				Content
			</TabView>
		);
	}
}
