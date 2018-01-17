import React from 'react';
import {Link} from 'react-router-dom';

/* eslint-disable */

const Login = () => (
	<div className="Login container">
		<div className="buttons">
			<Link to="/new-portfolio" className="btn btn-lg btn-primary btn-block">Create new portfolio</Link>
		</div>
  </div>
);

export default Login;
