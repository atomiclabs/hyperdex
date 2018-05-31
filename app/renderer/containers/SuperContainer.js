/* eslint-disable new-cap */
import {Container} from 'unstated';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import _ from 'lodash';

const toClassComponent = (FunctionalComponent, constructorHook) => {
	class ClassComponent extends React.Component {
		static get name() {
			return FunctionalComponent.name;
		}

		constructor(props) {
			super(props);

			if (constructorHook) {
				constructorHook(this);
			}
		}

		render() {
			return FunctionalComponent(this.props);
		}
	}

	ClassComponent.displayName = FunctionalComponent.displayName || FunctionalComponent.name;
	hoistNonReactStatics(ClassComponent, FunctionalComponent);

	return ClassComponent;
};

const addLifeCycleHooks = (self, lifecycleHooks) => {
	for (const [key, value] of Object.entries(lifecycleHooks)) {
		if (key === 'constructor') {
			value(self.props);
			continue;
		}

		self[key] = value;
	}
};

// eslint-disable-next-line no-unused-vars
const withState = (FunctionalComponent, initialState = {}, lifecycleHooks = {}) => {
	return toClassComponent(FunctionalComponent, self => {
		self.state = initialState;
		addLifeCycleHooks(self, lifecycleHooks);

		self.render = () => FunctionalComponent({
			...self.props,
			state: self.state,
			setState: self.setState.bind(self),
		});
	});
};

const withLifecycleHooks = (FunctionalComponent, lifecycleHooks = {}) => {
	return toClassComponent(FunctionalComponent, self => {
		addLifeCycleHooks(self, lifecycleHooks);
	});
};

class SuperContainer extends Container {
	state = {};

	constructor(...args) {
		super(...args);
		this.resetState();
	}

	resetState() {
		if (this.getInitialState) {
			this.state = this.getInitialState();
		}
	}

	// Connect the container to a component to receive some lifecycle hooks
	connect(component) {
		const self = this;

		if (self.componentDidMountOnce) {
			self.componentDidMountOnce = _.once(self.componentDidMountOnce);
		}

		if (self.componentWillUnmountOnce) {
			self.componentWillUnmountOnce = _.once(self.componentWillUnmountOnce);
		}

		return withLifecycleHooks(component, {
			componentDidMount() {
				if (self.componentDidMount) {
					self.componentDidMount();
				}

				// Special hook that is only executed once
				if (self.componentDidMountOnce) {
					self.componentDidMountOnce();
				}
			},
			componentWillUnmount() {
				if (self.componentWillUnmount) {
					self.componentWillUnmount();
				}

				if (self.componentWillUnmountOnce) {
					self.componentDidMountOnce();
				}
			},
		});
	}
}

export default SuperContainer;
