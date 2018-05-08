'use strict';
const MAX_INT32 = 2147483647;
const MINSTD = 16807;

module.exports = class {
	constructor(seed) {
		if (!Number.isInteger(seed)) {
			throw new TypeError('Expected `seed` to be a `integer`');
		}

		this._seed = seed % MAX_INT32;

		if (this._seed <= 0) {
			this._seed += (MAX_INT32 - 1);
		}
	}

	integer() {
		this._seed *= MINSTD;
		this._seed %= MAX_INT32;
		return this._seed;
	}

	integerInRange(min, max) {
		return Math.round(this.floatInRange(min, max));
	}

	float() {
		return (this.integer() - 1) / (MAX_INT32 - 1);
	}

	floatInRange(min, max) {
		return min + ((max - min) * this.float());
	}

	boolean() {
		return this.integer() % 2 === 0;
	}
};
