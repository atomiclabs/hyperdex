'use strict';
const ParkMiller = require('park-miller');
const stringHash = require('@sindresorhus/string-hash');
const color = require('color');

const MAX_INT32 = 2147483647;
const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

module.exports = class {
	constructor(options = {}) {
		let {seed} = options;

		if (typeof seed === 'string') {
			seed = stringHash(seed);
		}

		if (!Number.isInteger(seed)) {
			throw new TypeError('Expected `seed` to be a `integer`');
		}

		this._random = new ParkMiller(seed);
	}

	integer() {
		return this._random.integer();
	}

	integerInRange(min, max) {
		return this._random.integerInRange(min, max);
	}

	float() {
		return this._random.float();
	}

	floatInRange(min, max) {
		return this._random.floatInRange(min, max);
	}

	boolean() {
		return this._random.boolean();
	}

	arrayItem(array) {
		return array[Math.floor(this.float() * array.length)];
	}

	date() {
		return new Date(Date.now() * this.float());
	}

	dateInRange(startDate, endDate) {
		return new Date(this.integerInRange(startDate.getTime(), endDate.getTime()));
	}

	color(saturation) {
		saturation = saturation || 0.5;

		let hue = this.float();
		hue += GOLDEN_RATIO_CONJUGATE;
		hue %= 1;

		return color({
			h: hue * 360,
			s: saturation * 100,
			v: 95
		});
	}
};

module.exports.seed = () => Math.floor(Math.random() * MAX_INT32);
