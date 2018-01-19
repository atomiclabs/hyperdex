import React from 'react';
import TabView from './tab-view';

/* eslint-disable */

export default class Swap extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TabView {...this.props} title="Swap">
				Content
			</TabView>
		);
	}
}
