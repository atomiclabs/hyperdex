import React from 'react';
import PropTypes from 'prop-types';

const View = ({component: Component, ...rest}) => (
	Component.name === rest.activeView ? <Component {...rest}/> : null
);

View.propTypes = {
	component: PropTypes.elementType.isRequired,
};

export default View;
