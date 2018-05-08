'use strict';

module.exports = fn => val => {
	const ret = () => val;
	return Promise.resolve(val).then(fn).then(ret, ret);
};

module.exports.catch = fn => err => {
	const ret = () => Promise.reject(err);
	return Promise.resolve(err).then(fn).then(ret, ret);
};
