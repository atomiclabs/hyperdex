'use strict';
const path = require('path');
const webpack = require('webpack');
const NodeEnvPlugin = require('node-env-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const bootstrapPath = path.join(__dirname, 'vendor/bootstrap-dashboard-theme');
const reactSymbolsPath = path.join(__dirname, 'vendor/reactsymbols-kit');

module.exports = {
	entry: './app/renderer',
	output: {
		path: path.join(__dirname, 'app/renderer-dist'),
		filename: 'bundle.js',
	},
	target: 'electron',
	devtool: NodeEnvPlugin.devtool,
	resolve: {
		extensions: [
			'.js',
			'.jsx',
		],
		alias: {
			bootstrap: path.resolve(bootstrapPath, 'js/bootstrap'),
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [
						'react',
						'stage-3',
					],
				},
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [{
					loader: 'style-loader',
				}, {
					loader: 'css-loader',
					options: {
						alias: {
							'../fonts': path.join(bootstrapPath, 'fonts'),
						},
					},
				}, {
					loader: 'sass-loader',
					options: {
						includePaths: [
							path.join(bootstrapPath, 'scss'),
							path.join(reactSymbolsPath, 'sass'),
						],
					},
				}],
			},
			{
				test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
				exclude: /node_modules/,
				loader: 'file-loader',
			},
		],
	},
	plugins: [
		new NodeEnvPlugin(),
		new CopyPlugin([
			{
				context: 'app/renderer',
				from: '**/*',
				ignore: '*.js',
			},
		]),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			Popper: 'popper.js/dist/umd/popper.js',
		}),
	],
};
