import React from 'react';
import Spinner from 'components/Spinner';
import './LoggingIn.scss';

const LoggingIn = () => (
	<div className="LoggingIn">
		<Spinner/>
		<p>Logging in…</p>
	</div>
);

export default LoggingIn;
