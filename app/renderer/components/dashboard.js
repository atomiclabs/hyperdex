import React from 'react';
import TabView from './tab-view';

/* eslint-disable */

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mmPortfolio: null,
		};

		const {portfolio} = this.props;
		const {api} = portfolio;

		(async () => {
			this.setState({
				mmPortfolio: await api.portfolio(),
			});
		})();
	}

	render() {
		return (
			<TabView {...this.props}  title="Dashboard">
					<p>Portfolio: {JSON.stringify(this.state.mmPortfolio, null, '\t')}</p>
			</TabView>
		);
	}
}
