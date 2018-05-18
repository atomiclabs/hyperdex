import electron from 'electron';
import React from 'react';

const open = electron.shell.openExternal;

const ExternalLink = ({url, ...props}) => <a {...props} onClick={() => open(url)}/>;

export default ExternalLink;
