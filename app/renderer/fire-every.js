const fireEvery = (cb, delay) => {
	let timeoutId = 0;

	(async function fire() {
		const startTime = Date.now();
		await cb();
		timeoutId = setTimeout(fire, delay - (Date.now() - startTime));
	})();

	return () => clearTimeout(timeoutId);
};

export default fireEvery;
