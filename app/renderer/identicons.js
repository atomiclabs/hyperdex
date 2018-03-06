'use strict';
const Randoma = require('randoma');

// TODO(sindresorhus): Extract this into a npm package when it's more mature

const createIconData = options => {
	const random = new Randoma({seed: options.seed});
	const size = options.size;
	const sourceWidth = Math.ceil(size / 2);
	const mirrorWidth = size - sourceWidth;

	const ret = [];

	for (let y = 0; y < size; y++) {
		let row = [];
		for (let x = 0; x < sourceWidth; x++) {
			row[x] = random.boolean();
		}

		// Mirror it
		const r = row.slice(0, mirrorWidth);
		r.reverse();
		row = row.concat(r);

		for (const item of row) {
			ret.push(item);
		}
	}

	return ret;
};

const createSvgElement = name => document.createElementNS('http://www.w3.org/2000/svg', name);

module.exports = options => {
	options = Object.assign({
		size: 10,
		scale: 10,
		seed: Math.random().toString(36).slice(2),
		color: '#fff',
		outputFormat: 'svg',
	}, options);

	if (Array.isArray(options.color)) {
		const random = new Randoma({seed: options.seed});
		options.color = random.arrayItem(options.color);
	}

	const scale = options.scale;
	const iconData = createIconData(options);
	const sideLength = Math.sqrt(iconData.length);
	const actualSideLength = sideLength * scale;

	const svg = createSvgElement('svg');
	svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	svg.setAttribute('width', actualSideLength);
	svg.setAttribute('height', actualSideLength);
	svg.setAttribute('viewBox', `0 0 ${actualSideLength} ${actualSideLength}`);

	const defs = createSvgElement('defs');
	svg.appendChild(defs);

	const group = createSvgElement('g');
	svg.appendChild(group);

	if (typeof options.color === 'string') {
		group.setAttribute('fill', options.color);
	} else {
		const gradient = createSvgElement('linearGradient');
		gradient.setAttribute('id', 'gradient');
		gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
		gradient.setAttribute('gradientTransform', `rotate(${options.color.angle})`);
		defs.appendChild(gradient);

		const stop1 = createSvgElement('stop');
		stop1.setAttribute('offset', '0%');
		stop1.setAttribute('style', `stop-color:${options.color.from};stop-opacity:1`);
		gradient.appendChild(stop1);

		const stop2 = createSvgElement('stop');
		stop2.setAttribute('offset', '100%');
		stop2.setAttribute('style', `stop-color:${options.color.to};stop-opacity:1`);
		gradient.appendChild(stop2);

		group.setAttribute('fill', 'url(#gradient)');
	}

	for (const [i, data] of iconData.entries()) {
		if (!data) {
			continue;
		}

		const row = Math.floor(i / sideLength);
		const column = i % sideLength;

		const rect = createSvgElement('rect');
		rect.setAttribute('x', column * scale);
		rect.setAttribute('y', row * scale);
		rect.setAttribute('width', scale);
		rect.setAttribute('height', scale);
		group.appendChild(rect);
	}

	if (options.outputFormat === 'dataUrl') {
		return `data:image/svg+xml;utf8,${encodeURIComponent(svg.outerHTML)}`;
	}

	return svg;
};
