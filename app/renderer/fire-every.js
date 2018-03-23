const fireEvery = (cb, delay) => new Promise(resolve => {
	let timeoutId = 0;

	(async function fire() {
		const startTime = Date.now();
		await cb();
		resolve(() => clearTimeout(timeoutId));
		timeoutId = setTimeout(fire, delay - (Date.now() - startTime));
	})();
});

export default fireEvery;
