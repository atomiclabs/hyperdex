import React from 'react';

class SuperComponent extends React.Component {
	state = {};

	constructor(...args) {
		super(...args);

		if (this.getInitialState) {
			this.state = this.getInitialState();
		}
	}

	resetState() {
		if (!this.getInitialState) {
			throw new Error('You need to use the `getInitialState` method to be able to reset the state');
		}

		const state = this.getInitialState();

		// We set this as `setState` only updates props in the initial state
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state = state;

		this.setState(state);
	}
}

export default SuperComponent;
