import electron from 'electron';
import React from 'react';

const {openExternal} = electron.shell;

const ExternalLink = ({url, ...props}) => <a {...props} onClick={() => openExternal(url)}/>;

export default ExternalLink;
