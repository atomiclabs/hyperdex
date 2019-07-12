import {remote} from 'electron';
import React from 'react';
import {Trans} from 'react-i18next';
import Modal from 'components/Modal';
import ExternalLink from 'components/ExternalLink';
import {instance, translate} from '../../translate';

const config = remote.require('./config');
const t = translate('dashboard');

class Intro extends React.Component {
	state = {
		shouldOpen: !config.get('hasShownDashboardIntro'),
	}

	closedHandler = () => {
		config.set('hasShownDashboardIntro', true);
		this.setState({shouldOpen: false});
	};

	render() {
		return (
			<Modal
				title={t('intro.title')}
				open={this.state.shouldOpen}
				didClose={this.closedHandler}
				width="500px"
			>
				<Trans i18n={instance} i18nKey="intro.description" t={t}>
					<p>Please keep in mind <strong>this project is still in Beta</strong>.</p>
					<p>Although loss of funds is unlikely, you should only trade with real currency if you can take that risk.</p>
					<p>If you just want to test HyperDEX, try trading between the test currencies <strong>RICK</strong> and <strong>MORTY</strong> instead. You can get free <strong>RICK</strong> <ExternalLink url="https://www.atomicexplorer.com/#/faucet/rick">here</ExternalLink> and free <strong>MORTY</strong> <ExternalLink url="https://www.atomicexplorer.com/#/faucet/morty">here</ExternalLink>.</p>
					<p>HyperDEX is Open Source software provided &qoute;as is&qoute;, without warranty of any kind. The authors or copyright holders are not liable for any damages caused as a result of using this software.</p>
					<p>By using HyperDEX you are agreeing to the terms of the <ExternalLink url="https://github.com/atomiclabs/hyperdex/blob/master/LICENSE">MIT License</ExternalLink>.</p>
				</Trans>
			</Modal>
		);
	}
}

export default Intro;
