import toMilliseconds from '@sindresorhus/to-milliseconds';
import delayModule from 'delay';

const fireEvery = async (delay, cb, options = {}) => {
	if (typeof delay !== 'number') {
		delay = toMilliseconds(delay);
	}

	if (options.startAfterDelay) {
		await delayModule(delay);
	}

	let timeoutId = 0;

	return (async function fire() {
		const startTime = Date.now();
		await cb();
		timeoutId = setTimeout(fire, delay - (Date.now() - startTime));
		return () => clearTimeout(timeoutId);
	})();
};

export default fireEvery;
