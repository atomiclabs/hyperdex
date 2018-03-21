import {is} from 'electron-util';
import {Container as C} from 'unstated';
import {detailedDiff} from 'deep-object-diff';

// TODO(sindresorhus): Extract this into a module when it's more mature
const unstatedDebug = options => {
	options = Object.assign({
		isEnabled: true,
		logStateChanges: true,
	}, options);

	return Container => {
		if (!options.isEnabled) {
			return Container;
		}

		if (!window.__UNSTATED__) {
			window.__UNSTATED__ = {
				isEnabled: true,
				logStateChanges: options.logStateChanges,
				containers: {},

				get states() {
					const ret = {};
					for (const [key, value] of Object.entries(this.containers)) {
						ret[key] = value.state;
					}
					return ret;
				},

				logState() {
					for (const [key, value] of Object.entries(this.containers)) {
						console.log(`%c${key}\n`, 'font-weight:bold', value.state);
					}
				},
			};
		}

		const globalInstance = window.__UNSTATED__;
		const logStateChangeKey = Symbol('log state key');

		class DebuggableContainer extends Container {
			[logStateChangeKey](state) {
				const {name} = this.constructor;
				const diff = detailedDiff(this.state, state);

				console.group(name);

				if (diff.added) {
					console.log('Added\n', diff.added);
				}

				if (diff.updated) {
					console.log('Updated\n', diff.updated);
				}

				if (diff.deleted) {
					console.log('Deleted\n', diff.deleted);
				}

				console.log('New state\n', state);
				console.log('Old state\n', this.state);

				console.groupEnd(name);
			}

			constructor(...args) {
				super(...args);
				globalInstance.containers[this.constructor.name] = this;
			}

			setState(state) {
				if (globalInstance.isEnabled && globalInstance.logStateChanges) {
					this[logStateChangeKey](state);
				}

				super.setState(state);
			}
		}

		return DebuggableContainer;
	};
};

const makeDebuggable = unstatedDebug({
	isEnabled: is.development,
	logStateChanges: false,
});

export default makeDebuggable(C);
