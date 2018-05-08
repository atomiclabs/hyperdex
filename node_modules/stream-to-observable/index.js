'use strict';
var Observable = require('any-observable');

function or(option, alternate, required) {
	var result = option === false ? false : option || alternate;

	if ((required && !result) || (result && typeof result !== 'string')) {
		throw new TypeError(alternate + 'Event must be a string.');
	}

	return result;
}

module.exports = function (stream, opts) {
	opts = opts || {};

	var complete = false;
	var dataListeners = [];
	var awaited = opts.await;
	var dataEvent = or(opts.dataEvent, 'data', true);
	var errorEvent = or(opts.errorEvent, 'error');
	var endEvent = or(opts.endEvent, 'end');

	function cleanup() {
		complete = true;
		dataListeners.forEach(function (listener) {
			stream.removeListener(dataEvent, listener);
		});
		dataListeners = null;
	}

	var completion = new Promise(function (resolve, reject) {
		function onEnd(result) {
			if (awaited) {
				awaited.then(resolve);
			} else {
				resolve(result);
			}
		}

		if (endEvent) {
			stream.once(endEvent, onEnd);
		} else if (awaited) {
			onEnd();
		}

		if (errorEvent) {
			stream.once(errorEvent, reject);
		}

		if (awaited) {
			awaited.catch(reject);
		}
	}).catch(function (err) {
		cleanup();
		throw err;
	}).then(function (result) {
		cleanup();
		return result;
	});

	return new Observable(function (observer) {
		completion
			.then(observer.complete.bind(observer))
			.catch(observer.error.bind(observer));

		if (complete) {
			return null;
		}

		var onData = function onData(data) {
			observer.next(data);
		};

		stream.on(dataEvent, onData);
		dataListeners.push(onData);

		return function () {
			stream.removeListener(dataEvent, onData);

			if (complete) {
				return;
			}

			var idx = dataListeners.indexOf(onData);

			if (idx !== -1) {
				dataListeners.splice(idx, 1);
			}
		};
	});
};
