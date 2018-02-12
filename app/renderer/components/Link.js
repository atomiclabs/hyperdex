import React from 'react';
import './Link.scss';

const Link = ({className, ...props}) => <button {...props} type="button" className={`${className} Link`}/>;

export default Link;
