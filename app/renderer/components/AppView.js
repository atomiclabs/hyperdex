import React from 'react';
import PropTypes from 'prop-types';
import View from 'components/View';
import appContainer from 'containers/App';

const AppView = ({component}) => (
	<View component={component} activeView={appContainer.state.activeView}/>
);

AppView.propTypes = {
	component: PropTypes.func,
};

export default AppView;
