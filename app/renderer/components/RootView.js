import React from 'react';
import View from 'components/View';
import rootContainer from 'containers/Root';

const RootView = ({component}) => (
	<View component={component} activeView={rootContainer.state.activeView}/>
);

export default RootView;
