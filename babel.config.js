'use strict';
const path = require('path');

const srcPath = path.join(__dirname, 'app', 'renderer');
const plugins = [
	[
		'styled-jsx/babel',
		{
			vendorPrefixes: false,
		},
	],
	'@babel/plugin-transform-modules-commonjs',
	'@babel/plugin-syntax-dynamic-import',
	'@babel/plugin-proposal-object-rest-spread',
	[
		'@babel/plugin-proposal-class-properties',
		{
			loose: false,
		},
	],
	[
		'module-resolver', {
			alias: {
				components: path.join(srcPath, 'components'),
				containers: path.join(srcPath, 'containers'),
				views: path.join(srcPath, 'views'),
				icons: path.join(srcPath, 'icons'),
			},
		},
	],
];

module.exports = {
	presets: [
		'@babel/preset-react',
	],
	plugins: [
		...plugins,
		'react-hot-loader/babel',
	],
	env: {
		test: {
			plugins: [
				...plugins,
				[
					'transform-require-ignore',
					{
						extensions: [
							'.css',
							'.scss',
						],
					},
				],
			],
		},
	},
};
