import React from 'react';
import electron from 'electron';

const open = electron.shell.openExternal;

const ExternalLink = ({url, ...props}) => <a {...props} onClick={() => open(url)}/>;

export default ExternalLink;
