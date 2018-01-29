'use strict';
const path = require('path');
const webpack = require('webpack');
const NodeEnvPlugin = require('node-env-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
	dist: path.join(__dirname, 'app/renderer-dist'),
	bootstrap: path.join(__dirname, 'vendor/bootstrap-dashboard-theme'),
	reactSymbols: path.join(__dirname, 'vendor/reactsymbols-kit'),
};

module.exports = {
	entry: './app/renderer',
	output: {
		path: PATHS.dist,
		filename: 'bundle.js',
	},
	target: 'electron-renderer',
	devtool: NodeEnvPlugin.devtool,
	devServer: {
		contentBase: PATHS.dist,
		hot: true,
		historyApiFallback: true,
		overlay: true,
		noInfo: true,
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
							path.join(PATHS.reactSymbols, 'sass'),
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
			Popper: 'popper.js/dist/umd/popper.js',
		}),
		new webpack.NamedModulesPlugin(),
	],
};
