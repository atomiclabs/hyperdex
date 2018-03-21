import {is} from 'electron-util';
import {Container} from 'unstated';
import {detailedDiff} from 'deep-object-diff';

// TODO(sindresorhus): Extract this into a module when it's more mature
class CustomContainer extends Container {
	_logStateChange(state) {
		const {name} = this.constructor;
		const diff = detailedDiff(this.state, state);

		console.group(name);

		if (diff.added) {
			console.log('Added:', diff.added);
		}

		if (diff.updated) {
			console.log('Updated:', diff.updated);
		}

		if (diff.deleted) {
			console.log('Deleted:', diff.deleted);
		}

		console.log('New state:', state);
		console.log('Old state:', this.state);

		console.groupEnd(name);
	}

	setState(state) {
		if (is.development) {
			this._logStateChange(state);
		}

		super.setState(state);
	}
}

export default CustomContainer;
