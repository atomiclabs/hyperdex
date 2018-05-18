import electron from 'electron';
import React from 'react';
import Link from './Link';

const {openExternal} = electron.shell;

const ExternalLink = ({url, ...props}) => <Link {...props} onClick={() => openExternal(url)}/>;

export default ExternalLink;
