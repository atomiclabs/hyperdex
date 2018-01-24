import React from 'react';
import TabView from './tab-view';

/* eslint-disable */

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mmPortfolio: null,
		};

		const {portfolio, api} = this.props;

		(async () => {
			this.setState({
				mmPortfolio: await api.portfolio(),
			});
		})();
	}

	render() {
		return (
			<TabView {...this.props}  title="Dashboard">
					<p>Portfolio:</p>
					<pre style={{color: '#ccc', overflow: 'scroll', height: '600px'}}>{JSON.stringify(this.state.mmPortfolio, null, '\t')}</pre>
			</TabView>
		);
	}
}
