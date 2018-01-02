'use strict';
const path = require('path');
const NodeEnvPlugin = require('node-env-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './app/renderer',
	output: {
		path: path.join(__dirname, 'app/renderer-dist'),
		filename: 'bundle.js'
	},
	target: 'electron',
	resolve: {
		extensions: [
			'.js',
			'.jsx'
		]
	},
	devtool: NodeEnvPlugin.devtool,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [
						'react'
					]
				}
			}
		]
	},
	plugins: [
		new NodeEnvPlugin(),
		new CopyPlugin([
			{
				context: 'app/renderer',
				from: '*',
				ignore: '*.js'
			}
		])
	]
};
