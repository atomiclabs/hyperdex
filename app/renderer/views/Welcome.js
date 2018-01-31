import {api} from 'electron-util';
import React from 'react';
import {RSButton} from 'reactsymbols-kit';

const Welcome = () => (
	<div className="container Welcome">
		<div className="body">
			<h1>
				Welcome to HyperDEX!
			</h1>
			<h2>
				v{api.app.getVersion()}
			</h2>
			<p style={{fontSize: '16px', marginBottom: '40px'}}>
				HyperDEX is built on BarterDEX, the best cryptocurrency trading platform allowing the decentralized exchange  of a variety of altcoins and digital currency.
			</p>
			<RSButton value="Add New Portfolio" className="button-gradient"/>
		</div>
	</div>
);

export default Welcome;
