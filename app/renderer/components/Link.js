import React from 'react';

const Link = ({className = '', ...props}) => <a {...props} className={`${className} Link`}/>;

export default Link;
