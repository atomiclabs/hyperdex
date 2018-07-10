import React from 'react';
import {translate} from '../translate';
import TabView from './TabView';
import './Swap.scss';

const t = translate('swap');

class Swap extends React.Component {
	render() {
		return (
			<TabView title="Swap" className="Swap--wrapper">
				<div className="Swap">
					<div className="temp-message">
						<h1>{t('tempMessageTitle')}</h1>
						<p>{t('tempMessageDescription')}</p>
					</div>
				</div>
			</TabView>
		);
	}
}

export default Swap;
