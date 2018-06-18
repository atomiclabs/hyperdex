import React from 'react';
import Spinner from 'components/Spinner';
import {translate} from '../translate';
import './LoggingIn.scss';

const t = translate('login');

const LoggingIn = () => (
	<div className="LoggingIn">
		<Spinner/>
		<p>{t('loggingIn')}</p>
	</div>
);

export default LoggingIn;
