import React from 'react';
import {Link} from 'react-router-dom';

/* eslint-disable */

const Login = ({match}) => (
	<div className="Login container">
		<div className="buttons">
			<Link to={match.url + '/add-new'} className="btn btn-lg btn-primary btn-block">Create new portfolio</Link>
			<Link to={match.url + '/add-existing'} className="btn btn-lg btn-primary btn-block">Add existing portfolio</Link>
		</div>
  </div>
);

export default Login;
