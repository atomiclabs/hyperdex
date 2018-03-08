'use strict';
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
	dist: path.join(__dirname, 'app/renderer-dist'),
	bootstrap: path.join(__dirname, 'vendor/bootstrap-dashboard-theme'),
};

module.exports = {
	mode: 'development',
	entry: './app/renderer',
	output: {
		path: PATHS.dist,
		filename: 'bundle.js',
	},
	target: 'electron-renderer',
	devServer: {
		historyApiFallback: true,
		overlay: true,
		logLevel: 'warn',
	},
	optimization: {
		minimize: false,
	},
	resolve: {
		extensions: [
			'.js',
			'.jsx',
		],
		alias: {
			bootstrap: path.resolve(PATHS.bootstrap, 'js/bootstrap'),
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
					plugins: [
						['transform-class-properties', {spec: true}],
						'react-hot-loader/babel',
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
							'../fonts': path.join(PATHS.bootstrap, 'fonts'),
						},
					},
				}, {
					loader: 'sass-loader',
					options: {
						includePaths: [
							path.join(PATHS.bootstrap, 'scss'),
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
		new CleanWebpackPlugin([PATHS.dist]),
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
		}),
	],
};
