import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';

const getDisplayName = Component => Component.displayName || Component.name || 'Component';

const isStatelessComponent = Component => !(typeof Component.prototype !== 'undefined' && typeof Component.prototype.render === 'function');

let _globalState = null;
let _setState = null;

export default {
	get() {
		return _globalState;
	},

	set(state) {
		_setState(state);
	},

	capture(WrappedComponent) {
		const isStatelessComp = isStatelessComponent(WrappedComponent);
		const BaseComp = isStatelessComp ? React.Component : WrappedComponent;

		class ReactiveComponent extends BaseComp {
			constructor(props) {
				super(props);
				_globalState = this.state;
				_setState = this.setState.bind(this);
			}

			render() {
				_globalState = this.state;
				return isStatelessComp ? WrappedComponent(this.props, this.context) : super.render();
			}
		}

		// hoistNonReactStatic(ReactiveComponent, WrappedComponent);
		ReactiveComponent.displayName = `Reactive(${getDisplayName(WrappedComponent)})`;

		return ReactiveComponent;
	}
};
