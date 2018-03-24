import React from 'react';
import View from 'components/View';
import appContainer from 'containers/App';

const AppView = ({component}) => (
	<View component={component} activeView={appContainer.state.activeView}/>
);

export default AppView;
