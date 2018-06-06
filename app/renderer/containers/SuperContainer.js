/* eslint-disable new-cap */
import {Container} from 'unstated';
import React from 'react';
import {isStatelessComponent} from 'react-extras';
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

const hookConstructor = (Component, constructorHook) => {
	if (isStatelessComponent(Component)) {
		return toClassComponent(Component, constructorHook);
	}

	return class extends Component {
		constructor(...args) {
			super(...args);
			constructorHook(this);
		}
	};
};

const addLifeCycleHooks = (self, lifecycleHooks) => {
	for (const [hookName, hook] of Object.entries(lifecycleHooks)) {
		if (hookName === 'constructor') {
			hook(self.props);
			continue;
		}

		const originalMethod = self[hookName];
		self[hookName] = function (...args) {
			originalMethod.call(this, ...args);
			hook(...args);
		};
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

const withLifecycleHooks = (Component, lifecycleHooks = {}) => {
	return hookConstructor(Component, self => {
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

	// Connect the container to a component to receive some of its lifecycle hooks
	// Returns a wrapped version of the given `component`
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
