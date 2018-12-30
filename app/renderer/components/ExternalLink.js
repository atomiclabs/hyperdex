import electron from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

const {openExternal} = electron.shell;

const ExternalLink = ({url, ...props}) => <Link {...props} onClick={() => openExternal(url)}/>;

ExternalLink.propTypes = {
	url: PropTypes.string.isRequired,
};

export default ExternalLink;
