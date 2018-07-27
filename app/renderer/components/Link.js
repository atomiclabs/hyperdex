import React from 'react';
import PropTypes from 'prop-types';

const Link = ({className, ...props}) => <a {...props} className={`${className} Link`}/>;

Link.propTypes = {
	className: PropTypes.string,
};

Link.defaultProps = {
	className: '',
};

export default Link;
