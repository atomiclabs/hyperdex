'use strict';
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

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
	devtool: isProduction ? 'hidden-source-map' : 'cheap-module-source-map',
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
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development'
		}),
		new CopyPlugin([
			{
				context: 'app/renderer',
				from: '*',
				ignore: '*.js'
			}
		])
	]
};
