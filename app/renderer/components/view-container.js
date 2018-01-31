import React from 'react';

const ViewContainer = ({activeView, children}) => React.Children.map(children, child => {
	if (child.props.name === activeView) {
		return {
			...child,
			props: {
				...child.props,
				isActive: true,
			},
		};
	}

	return child;
});

export default ViewContainer;
